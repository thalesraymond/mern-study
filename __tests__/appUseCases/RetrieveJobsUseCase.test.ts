import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import RetrieveJobsUseCase from '../../src/appUseCases/RetrieveJobsUseCase.js';
import { IJobRepository } from '../../src/domain/repositories/IJobRepository.js';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository.js';
import User from '../../src/domain/entities/User.js';
import Job, { JobStatus, JobType } from '../../src/domain/entities/Job.js';
import { EntityId } from '../../src/domain/entities/EntityId.js';
import NotFoundError from '../../src/errors/NotFoundError.js';
import Email from '../../src/domain/entities/Email.js';
import UserPassword from '../../src/domain/entities/UserPassword.js';
import UserRole from '../../src/domain/entities/UserRole.js';
import UnauthorizedError from '../../src/errors/UnauthorizedError.js';

vi.mock('../../src/appUseCases/ValidateOwnershipUseCase.js');

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
    const adminId = '60d5ec49e0d3f4a3c8d3e8b2';
    const jobId = '60d5ec49e0d3f4a3c8d3e8b3';
    const otherUserId = '60d5ec49e0d3f4a3c8d3e8b4';

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
    const otherUser = new User({
        id: new EntityId(otherUserId),
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: user.role,
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

    const jobByOther = new Job({
        id: job.id,
        company: job.company,
        position: job.position,
        status: job.status,
        jobType: job.jobType,
        location: job.location,
        createdBy: otherUser,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
    });

    beforeEach(() => {
        vi.clearAllMocks();
        retrieveJobsUseCase = new RetrieveJobsUseCase(mockJobRepository, mockUserRepository);
    });

    describe('execute', () => {
        it('should retrieve a single job by id successfully', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            (mockJobRepository.getById as Mock).mockResolvedValue(job);
            const mockValidateOwnership = vi.spyOn(retrieveJobsUseCase['ownershipUseCase'], 'execute').mockResolvedValue();


            const result = await retrieveJobsUseCase.execute({ userId, jobId });

            expect(result).toEqual(job);
            expect(mockUserRepository.getById).toHaveBeenCalledWith(new EntityId(userId));
            expect(mockJobRepository.getById).toHaveBeenCalledWith(new EntityId(jobId));
            expect(mockValidateOwnership).toHaveBeenCalledWith(user.id, job.createdBy.id);
        });

        it('should throw NotFoundError if job not found', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            (mockJobRepository.getById as Mock).mockResolvedValue(null);

            await expect(retrieveJobsUseCase.execute({ userId, jobId: '60d5ec49e0d3f4a3c8d3e8b5' })).rejects.toThrow(NotFoundError);
        });

        it('should throw UnauthorizedError when user tries to retrieve a job they do not own', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            (mockJobRepository.getById as Mock).mockResolvedValue(jobByOther);
            vi.spyOn(retrieveJobsUseCase['ownershipUseCase'], 'execute').mockRejectedValue(new UnauthorizedError("Not authorized to access this route"));


            await expect(retrieveJobsUseCase.execute({ userId, jobId })).rejects.toThrow(UnauthorizedError);
        });

        it('should retrieve all jobs for a specific user with filter and sort', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            (mockJobRepository.listByOwner as Mock).mockResolvedValue([job]);

            const result = await retrieveJobsUseCase.execute({ 
                userId, 
                search: 'Test', 
                jobStatus: 'pending', 
                jobType: 'full-time', 
                sort: 'newest' 
            });

            expect(result).toEqual([job]);
            expect(mockJobRepository.listByOwner).toHaveBeenCalledWith(new EntityId(userId), {
                search: 'Test',
                jobStatus: 'pending',
                jobType: 'full-time',
                sort: 'newest'
            });
        });



        it('should throw NotFoundError if user not found', async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(null);

            await expect(retrieveJobsUseCase.execute({ userId: '60d5ec49e0d3f4a3c8d3e8b6' })).rejects.toThrow(NotFoundError);
        });
    });
});