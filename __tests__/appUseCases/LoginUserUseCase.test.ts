import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import LoginUserUseCase from '../../src/appUseCases/LoginUserUseCase.js';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository.js';
import IPasswordManager from '../../src/domain/services/IPasswordManager.js';
import ITokenManager from '../../src/domain/services/ITokenManager.js';
import User from '../../src/domain/entities/User.js';
import { EntityId } from '../../src/domain/entities/EntityId.js';
import Email from '../../src/domain/entities/Email.js';
import UserPassword from '../../src/domain/entities/UserPassword.js';
import UserRole from '../../src/domain/entities/UserRole.js';
import UnauthorizedError from '../../src/errors/UnauthorizedError.js';

const mockUserRepository: IUserRepository = {
    findByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
    listAll: vi.fn(),
    count: vi.fn(),
    updateProfileImage: vi.fn(),
};

const mockPasswordManager: IPasswordManager = {
    hash: vi.fn(),
    compare: vi.fn(),
};

const mockTokenManager: ITokenManager = {
    generateToken: vi.fn(),
};

describe('LoginUserUseCase', () => {
    let loginUserUseCase: LoginUserUseCase;

    const user = new User({
        id: new EntityId('60d5ec49e0d3f4a3c8d3e8b1'),
        name: 'Test',
        lastName: 'User',
        email: Email.create('test@example.com'),
        password: UserPassword.createFromHashed('hashedPassword'),
        role: UserRole.USER,
        location: 'Test Location',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    beforeEach(() => {
        vi.clearAllMocks();
        loginUserUseCase = new LoginUserUseCase(mockUserRepository, mockPasswordManager, mockTokenManager);
    });

    describe('execute', () => {
        it('should return a token and user information on successful login', async () => {
            const request = { email: 'test@example.com', password: 'password123' };
            const token = 'jwt-token';

            (mockUserRepository.findByEmail as Mock).mockResolvedValue(user);
            (mockPasswordManager.compare as Mock).mockResolvedValue(true);
            (mockTokenManager.generateToken as Mock).mockReturnValue(token);

            const result = await loginUserUseCase.execute(request);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(Email.create(request.email));
            expect(mockPasswordManager.compare).toHaveBeenCalledWith(request.password, user.password.hashedPassword);
            expect(mockTokenManager.generateToken).toHaveBeenCalledWith({ userId: user.id.toString(), role: user.role.toString() });
            expect(result.token).toBe(token);
            expect(result.user.name).toBe(user.name);
        });

        it('should throw UnauthorizedError if user is not found', async () => {
            const request = { email: 'wrong@example.com', password: 'password123' };

            (mockUserRepository.findByEmail as Mock).mockResolvedValue(null);

            await expect(loginUserUseCase.execute(request)).rejects.toThrow(UnauthorizedError);
            expect(mockPasswordManager.compare).not.toHaveBeenCalled();
            expect(mockTokenManager.generateToken).not.toHaveBeenCalled();
        });

        it('should throw UnauthorizedError if password does not match', async () => {
            const request = { email: 'test@example.com', password: 'wrongpassword' };

            (mockUserRepository.findByEmail as Mock).mockResolvedValue(user);
            (mockPasswordManager.compare as Mock).mockResolvedValue(false);

            await expect(loginUserUseCase.execute(request)).rejects.toThrow(UnauthorizedError);
            expect(mockTokenManager.generateToken).not.toHaveBeenCalled();
        });
    });
});