import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import IPasswordManager from "../domain/services/IPasswordManager.js";
import ITokenManager from "../domain/services/ITokenManager.js";
import Email from "../domain/entities/Email.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

interface LoginUserRequest {
    email: string;
    password: string;
}

interface LoginUserResponse {
    token: string;
    user: {
        name: string;
        lastName: string;
        email: string;
        location: string;
    }
}

export default class LoginUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private passwordManager: IPasswordManager,
        private tokenManager: ITokenManager
    ) {}

    public async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
        const user = await this.userRepository.findByEmail(Email.create(request.email));

        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isValidPassword = await this.passwordManager.compare(request.password, user.password.hashedPassword);

        if (!isValidPassword) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const token = this.tokenManager.generateToken({
            userId: user.id.toString(),
            role: user.role.toString(),
        });

        return {
            token,
            user: {
                name: user.name,
                lastName: user.lastName,
                email: user.email.getValue(),
                location: user.location,
            }
        };
    }
}