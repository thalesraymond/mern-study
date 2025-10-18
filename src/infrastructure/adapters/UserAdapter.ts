import Adapter from "./Adapter.js";
import User from "../../domain/entities/User.js";
import { EntityId } from "../../domain/entities/EntityId.js";
import Email from "../../domain/entities/Email.js";
import { UserSchema } from "../models/users/UserModel.js";
import UserRole from "../../domain/entities/UserRole.js";
import { HydratedDocument } from "mongoose";
import UserPassword from "../../domain/entities/UserPassword.js";

export default class UserAdapter extends Adapter<User, UserSchema> {
    public override toDomain(raw: HydratedDocument<UserSchema>): User {
        return new User({
            id: new EntityId(raw._id.toString()),
            name: raw.name,
            lastName: raw.lastName,
            email: Email.create(raw.email),
            password: UserPassword.createFromHashed(raw.password),
            location: raw.location,
            role: raw.role as UserRole,
            imageId: raw.imageId,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }

    public toPersistence(user: User): UserSchema {
        return {
            name: user.name,
            lastName: user.lastName,
            email: user.email.getValue(),
            password: user.password.hashedPassword,
            location: user.location,
            role: user.role,
            imageId: user.imageId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
