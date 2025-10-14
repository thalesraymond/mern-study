import Email from "./Email";

export default class User {
    private readonly name: string;
    private readonly lastName: string;
    private readonly email: Email;
    private readonly password: string;
    private readonly location: string;

    constructor(
        name: string,
        lastName: string,
        email: Email,
        password: string,
        location: string
    ) {
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

    public getName(): string {
        return this.name;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public getEmail(): Email {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }

    public getLocation(): string {
        return this.location;
    }
}
