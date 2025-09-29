import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import UserModel from "../models/users/UserModel.js";
import { UserPayload } from "../requests/UserRequest.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import BadRequestError from "../errors/BadRequestError.js";
import PasswordUtils from "../utils/PasswordUtils.js";

export default class UserController {
    public register = async (
        req: Request<{}, {}, UserPayload>,
        res: Response<{ user: Omit<UserPayload, "password"> }>
    ) => {

        const existingUser = await UserModel.findOne({ email: req.body.email });

        if (existingUser) {
            throw new BadRequestError("E-mail already in use");
        }
        
        req.body.password = PasswordUtils.hashPassword(req.body.password);;

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
    };

    public auth = async (
        req: Request<{}, {}, { email: string; password: string }>,
        res: Response<{ user: Omit<UserPayload, "password"> }>
    ) => {
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

        // TODO: GET TOKEN TO RETURN TO CLIENT

        return res.status(StatusCodes.OK).json({
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
    };
}
