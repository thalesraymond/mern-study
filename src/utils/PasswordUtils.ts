import bcrypt from "bcryptjs";

export default class PasswordUtils {
    public static hashPassword(password: string) {
        const salt = bcrypt.genSaltSync(10);

        return bcrypt.hashSync(password, salt);
    }

    public static async comparePassword(password: string, hashedPassword: string) : Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

}