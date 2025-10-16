import { describe, it, expect } from "vitest";
import UserAdapter from "../../../src/infrastructure/adapters/UserAdapter.js";
import User from "../../../src/domain/entities/User.js";
import { EntityId } from "../../../src/domain/entities/EntityId.js";
import Email from "../../../src/domain/entities/Email.js";
import UserPassword from "../../../src/domain/entities/UserPassword.js";
import UserRole from "../../../src/domain/entities/UserRole.js";
import { HydratedDocument, Types } from "mongoose";
import { UserSchema } from "../../../src/infrastructure/models/users/UserModel.js";

describe("UserAdapter", () => {
    const adapter = new UserAdapter();

    const rawUser: HydratedDocument<UserSchema> = {
        _id: new Types.ObjectId(),
        name: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "hashedPassword",
        location: "New York",
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as HydratedDocument<UserSchema>;

    const domainUser = new User({
        id: new EntityId(new Types.ObjectId().toString()),
        name: "Jane",
        lastName: "Doe",
        email: Email.create("jane.doe@example.com"),
        password: UserPassword.createFromHashed("anotherHashedPassword"),
        location: "London",
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    describe("toDomain", () => {
        it("should convert a raw user object to a domain User entity", () => {
            const user = adapter.toDomain(rawUser);

            expect(user).toBeInstanceOf(User);
            expect(user.id.toString()).toBe(rawUser._id.toString());
            expect(user.name).toBe(rawUser.name);
            expect(user.lastName).toBe(rawUser.lastName);
            expect(user.email.getValue()).toBe(rawUser.email);
            expect(user.password.hashedPassword).toBe(rawUser.password);
            expect(user.location).toBe(rawUser.location);
            expect(user.role).toBe(rawUser.role);
            expect(user.createdAt).toBe(rawUser.createdAt);
            expect(user.updatedAt).toBe(rawUser.updatedAt);
        });
    });

    describe("toPersistence", () => {
        it("should convert a domain User entity to a raw user object", () => {
            const raw = adapter.toPersistence(domainUser);

            expect(raw.name).toBe(domainUser.name);
            expect(raw.lastName).toBe(domainUser.lastName);
            expect(raw.email).toBe(domainUser.email.getValue());
            expect(raw.password).toBe(domainUser.password.hashedPassword);
            expect(raw.location).toBe(domainUser.location);
            expect(raw.role).toBe(domainUser.role);
            expect(raw.createdAt).toBe(domainUser.createdAt);
            expect(raw.updatedAt).toBe(domainUser.updatedAt);
        });
    });
});