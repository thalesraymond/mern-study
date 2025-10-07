import jwt from "jsonwebtoken";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";

export default class TokenUtils {
    public static generateToken(payload: { userId: string; role: string }) {
        const secret = process.env.JWT_SECRET || "default_secret";
        const expiresIn = process.env.JWT_EXPIRES_IN ?? "1d";

        return jwt.sign(payload, secret, { expiresIn });
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
