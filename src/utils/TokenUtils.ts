import jwt from "jsonwebtoken";

export default class TokenUtils {
    private static ONE_DAY = 86400;

    public static generateToken(payload: { userId: string; role: string }) {
        const secret = process.env.JWT_SECRET || "default_secret";
        const expiresIn = (process.env.JWT_EXPIRES_IN ??
            TokenUtils.ONE_DAY) as number;

        return jwt.sign(payload, secret, { expiresIn: expiresIn });
    }

    public static verifyToken(token: string): { userId: string; role: string } {
        const secret = process.env.JWT_SECRET || "default_secret";

        const decoded = jwt.verify(token, secret);

        return decoded as { userId: string; role: string };
    }
}
