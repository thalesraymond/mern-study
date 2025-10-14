import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import UserModel, { UserSchema } from "../models/users/UserModel.js";
import { UpdateUserPayload, UserPayload } from "../requests/UserRequest.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import BadRequestError from "../errors/BadRequestError.js";
import PasswordUtils from "../utils/PasswordUtils.js";
import TokenUtils from "../utils/TokenUtils.js";
import { AuthResponse } from "../requests/AuthRequest.js";
import JobModel from "../models/jobs/JobModel.js";

export default class UserController {
    public async register(
        req: Request<{}, {}, UserPayload>,
        res: Response<{ user: Omit<UserPayload, "password"> }>
    ) {
        const existingUser = await UserModel.findOne({ email: req.body.email });

        if (existingUser) {
            throw new BadRequestError("E-mail already in use");
        }

        req.body.password = PasswordUtils.hashPassword(req.body.password);

        const user = await UserModel.create(req.body);

        return res.status(StatusCodes.CREATED).json({
            user: {
                id: user._id.toString(),
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                location: user.location,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }

    public async auth(
        req: Request<{}, {}, { email: string; password: string }>,
        res: Response<AuthResponse>
    ) {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const validPassword = await PasswordUtils.comparePassword(
            password,
            user.password
        );

        if (!validPassword) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const token = TokenUtils.generateToken({
            userId: user._id.toString(),
            role: user.role,
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
    }

    public async logout(_req: Request, res: Response) {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        return res.status(StatusCodes.OK).json({ msg: "User logged out" });
    }

    public async getCurrentUser(req: Request, res: Response) {
        const user: UserSchema | null = await UserModel.findById(
            req.user?.userId
        ).select("-password");

        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        return res.status(StatusCodes.OK).json({ user });
    }

    public async updateUser(
        req: Request<{}, {}, UpdateUserPayload>,
        res: Response
    ) {
        await UserModel.findByIdAndUpdate(req.user?.userId, req.body, {
            new: true,
        });

        return res.status(StatusCodes.NO_CONTENT).json({});
    }

    // TODO: This should not be here but the course states that should be, will refactor later.
    public async getAppStats(req: Request, res: Response) {
        const users = await UserModel.countDocuments();

        const jobs = await JobModel.countDocuments();

        return res.status(StatusCodes.OK).json({ users, jobs });
    }
}
