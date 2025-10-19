import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import ChangeJobUseCase, { ChangeJobRequest } from '../../src/appUseCases/ChangeJobUseCase.js';
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
import UnauthorizedError from '../../src/errors/UnauthorizedError.js';

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

describe('ChangeJobUseCase', () => {
    let changeJobUseCase: ChangeJobUseCase;

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
        changeJobUseCase = new ChangeJobUseCase(mockJobRepository, mockUserRepository);
    });

    describe('execute', () => {
        it('should create a new job if no jobId is provided', async () => {
            const request: ChangeJobRequest = {
                userId,
                company: 'New Company',
                position: 'New Position',
                status: JobStatus.INTERVIEW,
                jobType: JobType.PART_TIME,
                location: 'New Location',
            };

            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            (mockJobRepository.create as Mock).mockImplementation(job => Promise.resolve(job));

            const result = await changeJobUseCase.execute(request);

            expect(mockUserRepository.getById).toHaveBeenCalledWith(new EntityId(userId));
            expect(mockJobRepository.create).toHaveBeenCalled();
            expect(result.company).toBe(request.company);
            expect(result.position).toBe(request.position);
            expect(result.createdBy).toEqual(user);
        });

        it('should update an existing job if jobId is provided', async () => {
            const request: ChangeJobRequest = {
                userId,
                jobId,
                company: 'Updated Company',
                position: 'Updated Position',
                status: JobStatus.DECLINED,
                jobType: JobType.INTERNSHIP,
                location: 'Updated Location',
            };

            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            (mockJobRepository.getById as Mock).mockResolvedValue(job);
            (mockJobRepository.update as Mock).mockImplementation(job => Promise.resolve(job));
            vi.spyOn(changeJobUseCase['validateOwnership'], 'execute').mockResolvedValue();


            const result = await changeJobUseCase.execute(request);

            expect(mockUserRepository.getById).toHaveBeenCalledWith(new EntityId(userId));
            expect(mockJobRepository.getById).toHaveBeenCalledWith(new EntityId(jobId));
            expect(mockJobRepository.update).toHaveBeenCalled();
            expect(result.id).toEqual(job.id);
            expect(result.company).toBe(request.company);
            expect(result.position).toBe(request.position);
        });

        it('should throw UnauthenticatedError if user is not found', async () => {
            const request: ChangeJobRequest = {
                userId: '60d5ec49e0d3f4a3c8d3e8b4',
                company: 'Test Company',
                position: 'Test Position',
                status: JobStatus.PENDING,
                jobType: JobType.FULL_TIME,
                location: 'Test Location',
            };

            (mockUserRepository.getById as Mock).mockResolvedValue(null);

            await expect(changeJobUseCase.execute(request)).rejects.toThrow(UnauthenticatedError);
        });

        it('should throw NotFoundError if job is not found for update', async () => {
            const request: ChangeJobRequest = {
                userId,
                jobId: '60d5ec49e0d3f4a3c8d3e8b5',
                company: 'Test Company',
                position: 'Test Position',
                status: JobStatus.PENDING,
                jobType: JobType.FULL_TIME,
                location: 'Test Location',
            };

            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            (mockJobRepository.getById as Mock).mockResolvedValue(null);

            await expect(changeJobUseCase.execute(request)).rejects.toThrow(NotFoundError);
        });

        it('should throw UnauthorizedError if user does not own the job', async () => {
            const otherUser = new User({
                id: new EntityId(otherUserId),
                name: 'Other',
                lastName: 'User',
                email: Email.create('other@example.com'),
                password: UserPassword.createFromHashed('hashedPassword'),
                role: UserRole.USER,
                location: 'Other Location',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const jobOwnedByOther = new Job({
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

            const request: ChangeJobRequest = {
                userId,
                jobId,
                company: 'Updated Company',
                position: 'Updated Position',
                status: JobStatus.DECLINED,
                jobType: JobType.INTERNSHIP,
                location: 'Updated Location',
            };

            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            (mockJobRepository.getById as Mock).mockResolvedValue(jobOwnedByOther);
            vi.spyOn(changeJobUseCase['validateOwnership'], 'execute').mockRejectedValue(new UnauthorizedError("Not authorized to access this route"));


            await expect(changeJobUseCase.execute(request)).rejects.toThrow(UnauthorizedError);
        });
    });
});