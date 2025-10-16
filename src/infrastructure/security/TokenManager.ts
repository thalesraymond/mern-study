import jwt from "jsonwebtoken";
import ITokenManager from "../../domain/services/ITokenManager.js";

export default class TokenManager implements ITokenManager {
    private static ONE_DAY = 86400;

    public generateToken(payload: object): string {
        const secret = process.env.JWT_SECRET || "default_secret";
        const expiresIn = (process.env.JWT_EXPIRES_IN ??
            TokenManager.ONE_DAY) as number;

        return jwt.sign(payload, secret, { expiresIn: expiresIn });
    }

    public verifyToken(token: string): { userId: string; role: string } {
        const secret = process.env.JWT_SECRET || "default_secret";

        const decoded = jwt.verify(token, secret);

        return decoded as { userId: string; role: string };
    }
}