import bcrypt from "bcryptjs";
import IPasswordManager from "../../domain/services/IPasswordManager.js";

export default class PasswordManager implements IPasswordManager {
    public hash(password: string): string {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    public async compare(password: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(password, hashed);
    }
}