import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import DeleteJobUseCase, { DeleteJobRequest } from '../../src/appUseCases/DeleteJobUseCase.js';
import { IJobRepository } from '../../src/domain/repositories/IJobRepository.js';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository.js';
import User from '../../src/domain/entities/User.js';
import Job, { JobStatus, JobType } from '../../src/domain/entities/Job.js';
import { EntityId } from '../../src/domain/entities/EntityId.js';
import NotFoundError from '../../src/errors/NotFoundError.js';
import UnauthenticatedError from '../../src/errors/UnauthenticatedError.js';
import Email from '../../src/domain/entities/Email.js';
import UserPassword from '../../src/domain/entities/UserPassword.js';
import UserRole from '../../src/domain/entities/UserRole.js';

const mockJobRepository: IJobRepository = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
    listAll: vi.fn(),
    count: vi.fn(),
    findByIdAndOwner: vi.fn(),
    listByOwner: vi.fn(),
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

describe('DeleteJobUseCase', () => {
    let deleteJobUseCase: DeleteJobUseCase;

    const userId = '60d5ec49e0d3f4a3c8d3e8b1';
    const jobId = '60d5ec49e0d3f4a3c8d3e8b2';
    const otherUserId = '60d5ec49e0d3f4a3c8d3e8b3';


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
        deleteJobUseCase = new DeleteJobUseCase(mockJobRepository, mockUserRepository);
        // Mocking the validateOwnership use case inside DeleteJobUseCase
        vi.spyOn(deleteJobUseCase['validateOwnership'], 'execute').mockImplementation(async (userId, createdById) => {
            if (userId.toString() !== createdById.toString()) {
                throw new UnauthenticatedError('User does not own this job');
            }
        });
    });

    describe('execute', () => {
        it('should delete a job successfully', async () => {
            const request: DeleteJobRequest = { userId, jobId };

            (mockJobRepository.getById as Mock).mockResolvedValue(job);
            (mockJobRepository.delete as Mock).mockResolvedValue(undefined);

            await deleteJobUseCase.execute(request);

            expect(mockJobRepository.getById).toHaveBeenCalledWith(new EntityId(jobId));
            expect(deleteJobUseCase['validateOwnership'].execute).toHaveBeenCalledWith(new EntityId(userId), user.id);
            expect(mockJobRepository.delete).toHaveBeenCalledWith(new EntityId(jobId));
        });

        it('should throw NotFoundError if job is not found', async () => {
            const request: DeleteJobRequest = { userId, jobId: '60d5ec49e0d3f4a3c8d3e8b4' };

            (mockJobRepository.getById as Mock).mockResolvedValue(null);

            await expect(deleteJobUseCase.execute(request)).rejects.toThrow(NotFoundError);
        });

        it('should throw UnauthenticatedError if user does not own the job', async () => {
            const request: DeleteJobRequest = { userId: otherUserId, jobId };

            (mockJobRepository.getById as Mock).mockResolvedValue(job);

            await expect(deleteJobUseCase.execute(request)).rejects.toThrow(UnauthenticatedError);
            expect(deleteJobUseCase['validateOwnership'].execute).toHaveBeenCalledWith(new EntityId(otherUserId), user.id);
        });
    });
});