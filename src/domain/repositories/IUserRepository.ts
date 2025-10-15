import User from "../entities/User.js";
import { IRepository } from "./IRepository.js";

import Email from "../entities/Email.js";

export interface IUserRepository extends IRepository<User> {
    findByEmail(email: Email): Promise<User | null>;
    count(): Promise<number>;
}
