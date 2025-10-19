import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import RetrieveJobsUseCase from '../../src/appUseCases/RetrieveJobsUseCase.js';
import GetSingleJobUseCase from '../../src/appUseCases/GetSingleJobUseCase.js';
import SearchJobsUseCase from '../../src/appUseCases/SearchJobsUseCase.js';
import { IJobRepository } from '../../src/domain/repositories/IJobRepository.js';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository.js';
import Job, { JobStatus, JobType } from '../../src/domain/entities/Job.js';
import { EntityId } from '../../src/domain/entities/EntityId.js';
import User from '../../src/domain/entities/User.js';
import Email from '../../src/domain/entities/Email.js';
import UserPassword from '../../src/domain/entities/UserPassword.js';
import UserRole from '../../src/domain/entities/UserRole.js';

const mockGetSingleJobExecute = vi.fn();
const mockSearchJobsExecute = vi.fn();

vi.mock('../../src/appUseCases/GetSingleJobUseCase.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        execute: mockGetSingleJobExecute,
    })),
}));

vi.mock('../../src/appUseCases/SearchJobsUseCase.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        execute: mockSearchJobsExecute,
    })),
}));


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

describe('RetrieveJobsUseCase', () => {
    let retrieveJobsUseCase: RetrieveJobsUseCase;

    const userId = '60d5ec49e0d3f4a3c8d3e8b1';
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
        retrieveJobsUseCase = new RetrieveJobsUseCase(mockJobRepository, mockUserRepository);
    });

    describe('execute', () => {
        it('should delegate to GetSingleJobUseCase when jobId is provided', async () => {
            mockGetSingleJobExecute.mockResolvedValue(job);

            const result = await retrieveJobsUseCase.execute({ userId, jobId });

            expect(result).toEqual(job);
            expect(mockGetSingleJobExecute).toHaveBeenCalledWith({ userId, jobId });
        });

        it('should delegate to SearchJobsUseCase when jobId is not provided', async () => {
            const paginatedResult = { jobs: [job], totalJobs: 1, page: 1, totalPages: 1 };
            mockSearchJobsExecute.mockResolvedValue(paginatedResult);

            const searchParams = {
                userId,
                search: 'Test',
                jobStatus: 'pending',
                jobType: 'full-time',
                sort: 'newest',
                page: 1,
            };

            const result = await retrieveJobsUseCase.execute(searchParams);

            expect(result).toEqual(paginatedResult);
            expect(mockSearchJobsExecute).toHaveBeenCalledWith(searchParams);
        });
    });
});
