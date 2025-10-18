export default class Email {
    private readonly email: string;

    private constructor(email: string) {
        this.email = email;
    }

    public static create(email: string): Email {
        if (!this.isValid(email)) {
            throw new Error("Invalid email address");
        }
        return new Email(email);
    }

    public getValue(): string {
        return this.email;
    }

    private static isValid(email: string): boolean {
        if (!email) {
            return false;
        }

        if (email.length > 254) {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
