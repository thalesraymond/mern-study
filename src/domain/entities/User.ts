import Email from "./Email.js";

export default class User {
    public readonly name: string;
    public readonly lastName: string;
    public readonly email: Email;
    public readonly password: string;
    public readonly location: string;

    constructor({
        name,
        lastName,
        email,
        password,
        location,
    }: {
        name: string;
        lastName: string;
        email: Email;
        password: string;
        location: string;
    }) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.location = location;
        this.validate();
    }

    private validate(): void {
        if (!this.name || this.name.trim() === "") {
            throw new Error("name is required");
        }
        if (!this.lastName || this.lastName.trim() === "") {
            throw new Error("last name is required");
        }
        if (!this.password || this.password.length < 6) {
            throw new Error("password must be at least 6 characters long");
        }
        if (!this.location || this.location.trim() === "") {
            throw new Error("location is required");
        }
    }
}
