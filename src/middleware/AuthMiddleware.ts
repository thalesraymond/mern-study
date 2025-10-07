import { NextFunction, Response, Request } from "express";
import TokenUtils from "../utils/TokenUtils.js";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";

export default class AuthMiddleware {
    public static authenticateUser(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const token: string = req.cookies.token;

        if (!token) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        try {
            const userData = TokenUtils.verifyToken(token);

            req.user = userData;

            next();
        } catch {
            throw new UnauthenticatedError("Authentication Invalid");
        }
    }
}
