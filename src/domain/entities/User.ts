import Email from "./Email.js";
import { Entity } from "./Entity.js";
import { EntityId } from "./EntityId.js";
import UserPassword from "./UserPassword.js";
import UserRole from "./UserRole.js";

export default class User extends Entity {
    public readonly name: string;
    public readonly lastName: string;
    public readonly email: Email;
    public readonly password: UserPassword;
    public readonly location: string;
    public readonly role: UserRole;

    constructor({
        name,
        lastName,
        email,
        password,
        location,
        id,
        role,
        createdAt,
        updatedAt,
    }: {
        name: string;
        lastName: string;
        email: Email;
        password: UserPassword;
        location: string;
        id?: EntityId;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    }) {
        super({
            id,
            createdAt,
            updatedAt,
        });
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.location = location;
        this.role = role;
        this.validate();
    }

    private validate(): void {
        if (!this.name || this.name.trim() === "") {
            throw new Error("name is required");
        }
        if (!this.lastName || this.lastName.trim() === "") {
            throw new Error("last name is required");
        }
        if (!this.location || this.location.trim() === "") {
            throw new Error("location is required");
        }
        if (!this.email) {
            throw new Error("email is required");
        }
        if (!this.role) {
            throw new Error("role is required");
        }
    }
}
