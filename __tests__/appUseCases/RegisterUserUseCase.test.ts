import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterUserUseCase from '../../src/appUseCases/RegisterUserUseCase.js';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository.js';
import IPasswordManager from '../../src/domain/services/IPasswordManager.js';
import User from '../../src/domain/entities/User.js';
import { EntityId } from '../../src/domain/entities/EntityId.js';
import Email from '../../src/domain/entities/Email.js';
import UserPassword from '../../src/domain/entities/UserPassword.js';
import UserRole from '../../src/domain/entities/UserRole.js';
import BadRequestError from '../../src/errors/BadRequestError.js';

const mockUserRepository: IUserRepository = {
    findByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
    listAll: vi.fn(),
    count: vi.fn(),
};

const mockPasswordManager: IPasswordManager = {
    hash: vi.fn().mockResolvedValue('hashedPassword'),
    compare: vi.fn(),
};

describe('RegisterUserUseCase', () => {
    let registerUserUseCase: RegisterUserUseCase;

    const request = {
        name: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        location: 'Test Location',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        registerUserUseCase = new RegisterUserUseCase(mockUserRepository, mockPasswordManager);
    });

    describe('execute', () => {
        it('should register a new user successfully', async () => {
            const user = new User({
                id: new EntityId('60d5ec49e0d3f4a3c8d3e8b1'),
                ...request,
                email: Email.create(request.email),
                password: UserPassword.createFromHashed('hashedPassword'),
                role: UserRole.USER,
            });

            (mockUserRepository.findByEmail as vi.Mock).mockResolvedValue(null);
            (mockUserRepository.create as vi.Mock).mockResolvedValue(user);

            const result = await registerUserUseCase.execute(request);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(Email.create(request.email));
            expect(mockPasswordManager.hash).toHaveBeenCalledWith(request.password);
            expect(mockUserRepository.create).toHaveBeenCalled();
            expect(result.name).toBe(request.name);
            expect(result.email).toBe(request.email);
        });

        it('should throw BadRequestError if email is already in use', async () => {
            const existingUser = new User({
                id: new EntityId('60d5ec49e0d3f4a3c8d3e8b1'),
                ...request,
                email: Email.create(request.email),
                password: UserPassword.createFromHashed('hashedPassword'),
                role: UserRole.USER,
            });

            (mockUserRepository.findByEmail as vi.Mock).mockResolvedValue(existingUser);

            await expect(registerUserUseCase.execute(request)).rejects.toThrow(BadRequestError);
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });
    });
});