import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UpdateUserPayload, UserPayload } from "../requests/UserRequest.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { EntityId } from "../domain/entities/EntityId.js";
import RegisterUserUseCase from "../appUseCases/RegisterUserUseCase.js";
import PasswordManager from "../infrastructure/security/PasswordManager.js";
import LoginUserUseCase from "../appUseCases/LoginUserUseCase.js";
import TokenManager from "../infrastructure/security/TokenManager.js";
import { UpdateUserUseCase } from "../appUseCases/UpdateUserUseCase.js";
import { IStorageService } from "../domain/services/IStorageService.js";

export default class UserController {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly jobRepository: IJobRepository,
        private readonly storageService: IStorageService
    ) {}

    public register = async (
        req: Request<{}, {}, UserPayload>,
        res: Response<{ user: Omit<UserPayload, "password"> }>
    ) => {
        const useCase = new RegisterUserUseCase(this.userRepository, new PasswordManager());

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

    public auth = async (req: Request<{}, {}, { email: string; password: string }>, res: Response<{ msg: string }>) => {
        const useCase = new LoginUserUseCase(this.userRepository, new PasswordManager(), new TokenManager());

        const { token } = await useCase.execute(req.body);

        const jwtExpiration = process.env.JWT_EXPIRES_IN;

        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV === "production",
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
                role: user.role.toString(),
                imageId: user.imageId,
            },
        });
    };

    public updateUser = async (req: Request<{}, {}, UpdateUserPayload>, res: Response) => {
        if (!req.user?.userId) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const useCase = new UpdateUserUseCase(this.userRepository, this.storageService);

        const imageBuffer = req.file ? req.file.buffer : undefined;

        await useCase.execute(req.user.userId, imageBuffer);

        return res.status(StatusCodes.NO_CONTENT).json({});
    };

    public getAppStats = async (req: Request, res: Response) => {
        const users = await this.userRepository.count();
        const jobs = await this.jobRepository.count();

        return res.status(StatusCodes.OK).json({ users, jobs });
    };

    public getProfileImage = async (req: Request, res: Response) => {
        const userData = await this.userRepository.getById(new EntityId(req.user?.userId ?? ""));

        const imageBuffer = await this.storageService.getFile(userData?.imageId ?? "");

        res.setHeader("Content-Type", "image/png");

        return res.send(imageBuffer);
    };
}
