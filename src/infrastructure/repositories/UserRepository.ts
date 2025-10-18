import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import User from "../../domain/entities/User.js";
import Repository from "./Repository.js";
import UserModel, { UserSchema } from "../models/users/UserModel.js";
import UserAdapter from "../adapters/UserAdapter.js";
import Email from "../../domain/entities/Email.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { EntityId } from "../../domain/entities/EntityId.js";

export default class UserRepository extends Repository<User, UserSchema> implements IUserRepository {
    constructor() {
        super(UserModel, new UserAdapter());
    }

    async findByEmail(email: Email): Promise<User | null> {
        const document = await this.model.findOne({ email: email.getValue() });
        if (!document) {
            return null;
        }
        return this.adapter.toDomain(document);
    }

    async count(): Promise<number> {
        return await this.model.countDocuments();
    }

    async updateProfileImage(userId: EntityId, imageId: string): Promise<User> {
        const user = await this.model.findByIdAndUpdate(
            userId.toString(),
            { imageId },
            { new: true }
        );

        if (!user) {
            throw new BadRequestError(`User with id ${userId.toString()} not found`);
        }

        return this.adapter.toDomain(user);

    }


}
