import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import User from '../../domain/entities/User.js';
import Repository from './Repository.js';
import UserModel from '../../models/users/UserModel.js';
import UserAdapter from '../../adapters/UserAdapter.js';
import Email from '../../domain/entities/Email.js';

export default class UserRepository extends Repository<User> implements IUserRepository {
    constructor() {
        super(UserModel, new UserAdapter());
    }

    async findByEmail(email: Email): Promise<User | null> {
        const document = await this.model.findOne({ email: email.getValue() });
        if (!document) {
            return null;
        }
        return this.adapter.toDomain(document.toObject());
    }

    async count(): Promise<number> {
        return this.model.countDocuments();
    }
}
