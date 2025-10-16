import BadRequestError from "../../errors/BadRequestError.js";

export default class UserPassword {
    public readonly rawPassword: string;
    public readonly hashedPassword: string;

    private constructor({ rawPassword, hashedPassword }: { rawPassword?: string; hashedPassword?: string }) {
        this.rawPassword = rawPassword ?? "";
        this.hashedPassword = hashedPassword ?? "";

        this.validate();
    }

    private validate(): void {
        if (!this.rawPassword && !this.hashedPassword) {
            throw new BadRequestError("password is required");
        }

        if (this.rawPassword && this.rawPassword.length < 6) {
            throw new BadRequestError("password must be at least 6 characters long");
        }
    }

    public static createFromHashed(hashedPassword: string): UserPassword {
        return new UserPassword({ hashedPassword });
    }

    public static async create(rawPassword: string, hashFunction: (password: string) => Promise<string> | string): Promise<UserPassword> {
        const hashed = await hashFunction(rawPassword);
        return new UserPassword({
            rawPassword: rawPassword,
            hashedPassword: hashed,
        });
    }
}