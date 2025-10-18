import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateUserUseCase } from '../../dist/appUseCases/UpdateUserUseCase.js';
import { IUserRepository } from '../../dist/domain/repositories/IUserRepository.js';
import { IStorageService } from '../../dist/domain/services/IStorageService.js';
import User from '../../dist/domain/entities/User.js';
import Email from '../../dist/domain/entities/Email.js';
import { EntityId } from '../../dist/domain/entities/EntityId.js';
import UserPassword from '../../dist/domain/entities/UserPassword.js';
import UserRole from '../../dist/domain/entities/UserRole.js';
import BadRequestError from '../../dist/errors/BadRequestError.js';

describe('UpdateUserUseCase', () => {
    let updateUserUseCase: UpdateUserUseCase;
    let mockUserRepository: IUserRepository;
    let mockStorageService: IStorageService;

    const user = new User({
        id: new EntityId('60d5ec49e0d3f4a3c8d3e8b1'),
        name: 'Test User',
        lastName: 'Test',
        email: Email.create('test@example.com'),
        password: UserPassword.createFromHashed('hashedPassword'),
        role: UserRole.USER,
        location: 'Test Location',
    });

    beforeEach(() => {
        mockUserRepository = {
            getById: vi.fn(),
            update: vi.fn(),
            updateProfileImage: vi.fn(),
        } as unknown as IUserRepository;

        mockStorageService = {
            uploadFile: vi.fn(),
            deleteFile: vi.fn(),
        } as unknown as IStorageService;

        updateUserUseCase = new UpdateUserUseCase(mockUserRepository, mockStorageService);
    });

    it('should update a user without a profile image', async () => {
        const updateUserRequest = {
            id: '60d5ec49e0d3f4a3c8d3e8b1',
            name: 'Updated User',
            lastName: 'Updated',
            email: 'test@example.com',
            location: 'Updated Location',
        };

        vi.spyOn(mockUserRepository, 'getById').mockResolvedValue(user);
        vi.spyOn(mockUserRepository, 'update').mockResolvedValue(user);

        const result = await updateUserUseCase.execute(updateUserRequest);

        expect(mockUserRepository.getById).toHaveBeenCalledWith(new EntityId(updateUserRequest.id));
        expect(mockUserRepository.update).toHaveBeenCalled();
        expect(mockStorageService.uploadFile).not.toHaveBeenCalled();
        expect(result).toEqual(user);
    });

    it('should update a user with a new profile image', async () => {
        const updateUserRequest = {
            id: '60d5ec49e0d3f4a3c8d3e8b1',
            name: 'Updated User',
            lastName: 'Updated',
            email: 'test@example.com',
            location: 'Updated Location',
            profileImageBuffer: Buffer.from('new_image'),
        };

        vi.spyOn(mockUserRepository, 'getById').mockResolvedValue(user);
        vi.spyOn(mockUserRepository, 'update').mockResolvedValue(user);
        vi.spyOn(mockStorageService, 'uploadFile').mockResolvedValue('new_image_id');
        vi.spyOn(mockUserRepository, 'updateProfileImage').mockResolvedValue(user);

        const result = await updateUserUseCase.execute(updateUserRequest);

        expect(mockStorageService.uploadFile).toHaveBeenCalledWith(updateUserRequest.profileImageBuffer);
        expect(mockUserRepository.updateProfileImage).toHaveBeenCalledWith(user.id, 'new_image_id');
        expect(result).toEqual(user);
    });

    it('should delete the old profile image if a new one is uploaded', async () => {
        const userWithImage = new User({
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            role: user.role,
            location: user.location,
            imageId: 'old_image_id',
        });
        const updateUserRequest = {
            id: '60d5ec49e0d3f4a3c8d3e8b1',
            name: 'Updated User',
            lastName: 'Updated',
            email: 'test@example.com',
            location: 'Updated Location',
            profileImageBuffer: Buffer.from('new_image'),
        };

        vi.spyOn(mockUserRepository, 'getById').mockResolvedValue(userWithImage);
        vi.spyOn(mockUserRepository, 'update').mockResolvedValue(userWithImage);
        vi.spyOn(mockStorageService, 'deleteFile').mockResolvedValue(undefined);
        vi.spyOn(mockStorageService, 'uploadFile').mockResolvedValue('new_image_id');
        vi.spyOn(mockUserRepository, 'updateProfileImage').mockResolvedValue(userWithImage);

        await updateUserUseCase.execute(updateUserRequest);

        expect(mockStorageService.deleteFile).toHaveBeenCalledWith('old_image_id');
    });

    it('should throw an error if the profile image is too large', async () => {
        const updateUserRequest = {
            id: '60d5ec49e0d3f4a3c8d3e8b1',
            name: 'Updated User',
            lastName: 'Updated',
            email: 'test@example.com',
            location: 'Updated Location',
            profileImageBuffer: Buffer.alloc(1024 * 1024 * 3), // 3MB
        };

        vi.spyOn(mockUserRepository, 'getById').mockResolvedValue(user);
        vi.spyOn(mockUserRepository, 'update').mockResolvedValue(user);

        await expect(updateUserUseCase.execute(updateUserRequest)).rejects.toThrow(
            new BadRequestError("Image must be smaller than 2MB")
        );
    });

    it('should throw an error if the user is not found', async () => {
        const updateUserRequest = {
            id: '60d5ec49e0d3f4a3c8d3e8b1',
            name: 'Updated User',
            lastName: 'Updated',
            email: 'test@example.com',
            location: 'Updated Location',
        };

        vi.spyOn(mockUserRepository, 'getById').mockResolvedValue(null);

        await expect(updateUserUseCase.execute(updateUserRequest)).rejects.toThrow(
            new BadRequestError("user not found")
        );
    });
});
