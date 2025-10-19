import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import SearchJobsUseCase from '../../src/appUseCases/SearchJobsUseCase.js';
import { IJobRepository } from '../../src/domain/repositories/IJobRepository.js';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository.js';
import User from '../../src/domain/entities/User.js';
import Job, { JobStatus, JobType } from '../../src/domain/entities/Job.js';
import { EntityId } from '../../src/domain/entities/EntityId.js';
import NotFoundError from '../../src/errors/NotFoundError.js';
import Email from '../../src/domain/entities/Email.js';
import UserPassword from '../../src/domain/entities/UserPassword.js';
import UserRole from '../../src/domain/entities/UserRole.js';

const mockJobRepository: IJobRepository = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
    listAll: vi.fn(),
    listByOwner: vi.fn(),
    count: vi.fn(),
    findByIdAndOwner: vi.fn(),
    getStats: vi.fn(),
};

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

describe('SearchJobsUseCase', () => {
    let searchJobsUseCase: SearchJobsUseCase;

    const userId = '60d5ec49e0d3f4a3c8d3e8b1';
    const adminId = '60d5ec49e0d3f4a3c8d3e8b2';
    const jobId = '60d5ec49e0d3f4a3c8d3e8b3';

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

    const job = new Job({
        id: new EntityId(jobId),
        company: 'Test Company',
        position: 'Test Position',
        status: JobStatus.PENDING,
        jobType: JobType.FULL_TIME,
        location: 'Test Location',
        createdBy: user,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    beforeEach(() => {
        vi.clearAllMocks();
        searchJobsUseCase = new SearchJobsUseCase(mockJobRepository, mockUserRepository);
    });

    describe('execute', () => {
        it('should retrieve all jobs for a specific user with filter and sort', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            const paginatedResult = {
                jobs: [job],
                totalJobs: 1,
                page: 1,
                totalPages: 1,
            };
            (mockJobRepository.listByOwner as Mock).mockResolvedValue(paginatedResult);

            const result = await searchJobsUseCase.execute({
                userId,
                search: 'Test',
                jobStatus: 'pending',
                jobType: 'full-time',
                sort: 'newest',
                page: 1
            });

            expect(result).toEqual(paginatedResult);
            expect(mockJobRepository.listByOwner).toHaveBeenCalledWith(new EntityId(userId), {
                search: 'Test',
                jobStatus: 'pending',
                jobType: 'full-time',
                sort: 'newest',
                skip: 0,
                limit: 10
            });
        });

        it('should list jobs for admin without owner filter', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(adminUser);
            const paginatedResult = {
                jobs: [job],
                totalJobs: 1,
                page: 1,
                totalPages: 1,
            };
            (mockJobRepository.listByOwner as Mock).mockResolvedValue(paginatedResult);

            await searchJobsUseCase.execute({
                userId: adminId,
            });

            expect(mockJobRepository.listByOwner).toHaveBeenCalledWith(undefined, expect.any(Object));
        });

        it('should throw NotFoundError if user not found', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(null);

            await expect(searchJobsUseCase.execute({ userId: '60d5ec49e0d3f4a3c8d3e8b6' })).rejects.toThrow(NotFoundError);
        });
    });
});
