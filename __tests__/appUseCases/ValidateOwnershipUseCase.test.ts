import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import ValidateOwnershipUseCase from '../../src/appUseCases/ValidateOwnershipUseCase.js';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository.js';
import User from '../../src/domain/entities/User.js';
import { EntityId } from '../../src/domain/entities/EntityId.js';
import UnauthenticatedError from '../../src/errors/UnauthenticatedError.js';
import UnauthorizedError from '../../src/errors/UnauthorizedError.js';
import Email from '../../src/domain/entities/Email.js';
import UserPassword from '../../src/domain/entities/UserPassword.js';
import UserRole from '../../src/domain/entities/UserRole.js';

const mockUserRepository: IUserRepository = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
    listAll: vi.fn(),
    count: vi.fn(),
    findByEmail: vi.fn(),
    updateProfileImage: vi.fn(),
};

describe('ValidateOwnershipUseCase', () => {
    let validateOwnershipUseCase: ValidateOwnershipUseCase;

    const userId = '60d5ec49e0d3f4a3c8d3e8b1';
    const adminId = '60d5ec49e0d3f4a3c8d3e8b2';
    const documentOwnerId = '60d5ec49e0d3f4a3c8d3e8b3';

    const user = new User({
        id: new EntityId(userId),
        name: 'Test',
        lastName: 'User',
        email: Email.create('test@example.com'),
        password: UserPassword.createFromHashed('hashedPassword'),
        role: UserRole.USER,
        location: 'Test Location',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const adminUser = new User({
        id: new EntityId(adminId),
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: UserRole.ADMIN,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
    const ownerUser = new User({
        id: new EntityId(documentOwnerId),
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: user.role,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });

    beforeEach(() => {
        vi.clearAllMocks();
        validateOwnershipUseCase = new ValidateOwnershipUseCase(mockUserRepository);
    });

    describe('execute', () => {
        it('should not throw an error if the user is the owner', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(ownerUser);

            await expect(validateOwnershipUseCase.execute(ownerUser.id, ownerUser.id)).resolves.toBeUndefined();
        });

        it('should not throw an error if the user is an admin', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(adminUser);

            await expect(validateOwnershipUseCase.execute(adminUser.id, ownerUser.id)).resolves.toBeUndefined();
        });

        it('should throw UnauthorizedError if the user is not the owner and not an admin', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(user);

            await expect(validateOwnershipUseCase.execute(user.id, ownerUser.id)).rejects.toThrow(UnauthorizedError);
        });

        it('should throw UnauthenticatedError if the user is not found', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(null);

            await expect(validateOwnershipUseCase.execute(new EntityId('60d5ec49e0d3f4a3c8d3e8b4'), ownerUser.id)).rejects.toThrow(UnauthenticatedError);
        });
    });
});