import UserRole from "../domain/entities/UserRole.js";
import {IUserRepository} from "../domain/repositories/IUserRepository.js";
import Email from "../domain/entities/Email.js";
import BadRequestError from "../errors/BadRequestError.js";
import PasswordUtils from "../utils/PasswordUtils.js";
import User from "../domain/entities/User.js";
import UserPassword from "../domain/entities/UserPassword.js";

interface RegisterUserRequest {
    name: string;
    lastName: string;
    email: string;
    password: string;
    location: string;
}

interface RegisterUserResponse {
    id: string;
    name: string;
    lastName: string;
    email: string;
    role: UserRole;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

export default class RegisterUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    public async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
        const existingUser = await this.userRepository.findByEmail(Email.create(request.email));
        if (existingUser) {
            throw new BadRequestError("E-mail already in use");
        }

        const user = new User({
            name: request.name,
            lastName: request.lastName,
            location: request.location,
            email: Email.create(request.email),
            password: UserPassword.create(request.password, PasswordUtils.hashPassword),
            role: UserRole.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const created = await this.userRepository.create(user);

        return {
            id: created.id.toString(),
            name: created.name,
            lastName: created.lastName,
            email: created.email.getValue(),
            location: created.location,
            role: created.role,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        };
    }
}
