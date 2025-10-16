import { NextFunction, Response, Request } from "express";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";
import TokenManager from "../infrastructure/security/TokenManager.js";

export default class AuthMiddleware {
    constructor(private tokenManager: TokenManager) {}

    public authenticateUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const token: string = req.cookies.token;

        if (!token) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        try {
            const userData = this.tokenManager.verifyToken(token);

            req.user = userData;

            next();
        } catch {
            throw new UnauthenticatedError("Authentication Invalid");
        }
    }

    public authorizePermissions(...roles: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!roles.includes(req.user?.role ?? "")) {
                throw new UnauthenticatedError(
                    "Unauthorized to access this route"
                );
            }

            next();
        };
    }
}