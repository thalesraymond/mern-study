import jwt from "jsonwebtoken";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";

export default class TokenUtils {
    private static ONE_DAY = 86400;

    public static generateToken(payload: { userId: string; role: string }) {
        const secret = process.env.JWT_SECRET || "default_secret";
        const expiresIn = (process.env.JWT_EXPIRES_IN ?? TokenUtils.ONE_DAY) as number;

        return jwt.sign(payload, secret, { expiresIn: expiresIn});
    }

    public static verifyToken(token: string) {
        const secret = process.env.JWT_SECRET || "default_secret";

        try {
            return jwt.verify(token, secret);
        } catch {
            throw new UnauthenticatedError("Invalid token");
        }
    }
}
