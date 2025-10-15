import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UpdateUserPayload, UserPayload } from "../requests/UserRequest.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import PasswordUtils from "../utils/PasswordUtils.js";
import TokenUtils from "../utils/TokenUtils.js";
import { AuthResponse } from "../requests/AuthRequest.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import Email from "../domain/entities/Email.js";
import User from "../domain/entities/User.js";
import { EntityId } from "../domain/entities/EntityId.js";
import RegisterUserUseCase from "../appUseCases/RegisterUserUseCase.js";

export default class UserController {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly jobRepository: IJobRepository
    ) {}

    public register = async (req: Request<{}, {}, UserPayload>, res: Response<{ user: Omit<UserPayload, "password"> }>) => {
        const useCase = new RegisterUserUseCase(this.userRepository);

        const createdUser = await useCase.execute({
            name: req.body.name,
            lastName: req.body.lastName ?? "",
            email: req.body.email,
            password: req.body.password,
            location: req.body.location ?? "",
        });

        return res.status(StatusCodes.CREATED).json({
            user: createdUser,
        });
    };

    public auth = async (req: Request<{}, {}, { email: string; password: string }>, res: Response<AuthResponse>) => {
        const { email, password } = req.body;

        const user = await this.userRepository.findByEmail(Email.create(email));

        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const validPassword = await PasswordUtils.comparePassword(password, user.password.hashedPassword);

        if (!validPassword) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const token = TokenUtils.generateToken({
            userId: user.id.toString(),
            role: user.role.toString(),
        });

        const jwtExpiration = process.env.JWT_EXPIRES_IN;

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + Number(jwtExpiration) * 1000),
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(StatusCodes.OK).json({
            msg: "User logged in successfully",
        });
    };

    public logout = async (_req: Request, res: Response) => {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        return res.status(StatusCodes.OK).json({ msg: "User logged out" });
    };

    public getCurrentUser = async (req: Request, res: Response) => {
        if (!req.user?.userId) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const user = await this.userRepository.getById(new EntityId(req.user.userId));

        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        return res.status(StatusCodes.OK).json({
            user: {
                id: user.id!.toString(),
                name: user.name,
                lastName: user.lastName,
                email: user.email.getValue(),
                location: user.location,
            },
        });
    };

    public updateUser = async (req: Request<{}, {}, UpdateUserPayload>, res: Response) => {
        if (!req.user?.userId) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const userToUpdate = await this.userRepository.getById(new EntityId(req.user.userId));

        if (!userToUpdate) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const updatedUser = new User({
            ...userToUpdate,
            ...req.body,
            id: userToUpdate.id,
            email: userToUpdate.email, // email cannot be updated
        });

        await this.userRepository.update(updatedUser);

        return res.status(StatusCodes.NO_CONTENT).json({});
    };

    public getAppStats = async (req: Request, res: Response) => {
        const users = await this.userRepository.count();
        const jobs = await this.jobRepository.count();

        return res.status(StatusCodes.OK).json({ users, jobs });
    };
}
