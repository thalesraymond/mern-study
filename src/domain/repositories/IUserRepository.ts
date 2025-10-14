import User from "../entities/User.js";
import { IRepository } from "./IRepository.js";

export interface IUserRepository extends IRepository<User> {}
