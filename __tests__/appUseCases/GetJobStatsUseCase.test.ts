import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import GetJobStatsUseCase from '../../src/appUseCases/GetJobStatsUseCase.js';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository.js';
import { IJobRepository } from '../../src/domain/repositories/IJobRepository.js';
import NotFoundError from '../../src/errors/NotFoundError.js';
import User from '../../src/domain/entities/User.js';
import { EntityId } from '../../src/domain/entities/EntityId.js';
import { StatsDto } from '../../src/appUseCases/dtos/StatsDto.js';
import UserRole from '../../src/domain/entities/UserRole.js';
import Email from '../../src/domain/entities/Email.js';
import UserPassword from '../../src/domain/entities/UserPassword.js';

describe('GetJobStatsUseCase', () => {
    let getJobStatsUseCase: GetJobStatsUseCase;
    let mockUserRepository: IUserRepository;
    let mockJobRepository: IJobRepository;

    const userId = '60d5ec49e0d3f4a3c8d3e8b1';
    const user = new User({
        id: new EntityId(userId),
        name: 'Test',
        lastName: 'User',
        email: Email.create('test@example.com'),
        password: UserPassword.createFromHashed('password123'),
        location: 'Test Location',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const stats: StatsDto = {
        stats: {
            pending: 1,
            interview: 2,
            declined: 3,
        },
        monthlyApplications: [],
    };

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: vi.fn(),
            getById: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            listAll: vi.fn(),
            count: vi.fn(),
            updateProfileImage: vi.fn(),
        };

        mockJobRepository = {
            getById: vi.fn(),
            listByOwner: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            getStats: vi.fn(),
            count: vi.fn(),
            findByIdAndOwner: vi.fn(),
            listAll: vi.fn(),
        };

        getJobStatsUseCase = new GetJobStatsUseCase(
            mockJobRepository,
            mockUserRepository
        );
    });

    it('should retrieve job stats for a valid user', async () => {
        (mockUserRepository.getById as Mock).mockResolvedValue(user);
        (mockJobRepository.getStats as Mock).mockResolvedValue(stats);

        const result = await getJobStatsUseCase.execute(userId);

        expect(mockUserRepository.getById).toHaveBeenCalledWith(
            new EntityId(userId)
        );
        expect(mockJobRepository.getStats).toHaveBeenCalledWith(user.id);
        expect(result).toEqual(stats);
    });

    it('should throw NotFoundError if the user does not exist', async () => {
        (mockUserRepository.getById as Mock).mockResolvedValue(null);

        await expect(getJobStatsUseCase.execute(userId)).rejects.toThrow(
            NotFoundError
        );
        await expect(getJobStatsUseCase.execute(userId)).rejects.toThrow(
            `User with id ${userId} not found`
        );
        expect(mockJobRepository.getStats).not.toHaveBeenCalled();
    });
});
