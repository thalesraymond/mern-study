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

    public static create(hashedPassword: string): UserPassword;
    public static create(rawPassword: string, hashFunction: (password: string) => string): UserPassword;
    public static create(hashedOrRawPassword: string, hashFunction?: (password: string) => string): UserPassword {
        if (hashFunction != undefined) {
            const raw = hashedOrRawPassword;
            const hashed = hashFunction(raw);
            return new UserPassword({
                rawPassword: raw,
                hashedPassword: hashed,
            });
        }

        return new UserPassword({ hashedPassword: hashedOrRawPassword });
    }
}
