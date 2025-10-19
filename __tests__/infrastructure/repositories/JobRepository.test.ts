import { describe, it, expect, vi, beforeEach } from 'vitest';
import JobRepository from '../../../src/infrastructure/repositories/JobRepository.js';
import JobModel from '../../../src/infrastructure/models/jobs/JobModel.js';
import JobAdapter from '../../../src/infrastructure/adapters/JobAdapter.js';
import Job from '../../../src/domain/entities/Job.js';
import { EntityId } from '../../../src/domain/entities/EntityId.js';
import JobStatus from '../../../src/infrastructure/models/jobs/JobStatus.js';
import JobType from '../../../src/infrastructure/models/jobs/JobType.js';
import User from '../../../src/domain/entities/User.js';
import Email from '../../../src/domain/entities/Email.js';
import UserPassword from '../../../src/domain/entities/UserPassword.js';
import UserRole from '../../../src/domain/entities/UserRole.js';

vi.mock('../../../src/infrastructure/models/jobs/JobModel.js');
vi.mock('../../../src/infrastructure/adapters/JobAdapter.js');

describe('JobRepository', () => {
    let jobRepository: JobRepository;
    let mockJobModel: any;
    let mockJobAdapter: any;

    const jobDomain = new Job({
        company: 'Test Company',
        position: 'Test Position',
        status: JobStatus.PENDING,
        jobType: JobType.FULL_TIME,
        location: 'Test Location',
        createdBy: new User({
            id: new EntityId('60d5ec49e0d3f4a3c8d3e8b2'),
            name: 'test',
            lastName: 'test',
            email: Email.create('test@test.com'),
            password: UserPassword.createFromHashed('test'),
            location: 'test',
            role: UserRole.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
        }),
        id: new EntityId('60d5ec49e0d3f4a3c8d3e8b1'),
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const jobPersistence = {
        _id: '60d5ec49e0d3f4a3c8d3e8b1',
        company: 'Test Company',
        position: 'Test Position',
        status: 'pending',
        type: 'full-time',
        location: 'Test Location',
        createdBy: '60d5ec49e0d3f4a3c8d3e8b2',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockJobModel = JobModel;
        mockJobAdapter = new JobAdapter();
        jobRepository = new JobRepository();
        (jobRepository as any).model = mockJobModel;
        (jobRepository as any).adapter = mockJobAdapter;

        vi.spyOn(mockJobAdapter, 'toDomain').mockResolvedValue(jobDomain);
        vi.spyOn(mockJobAdapter, 'toPersistence').mockReturnValue(jobPersistence);
    });

    describe('count', () => {
        it('should return the total number of jobs', async () => {
            mockJobModel.countDocuments.mockResolvedValue(5);

            const result = await jobRepository.count();

            expect(mockJobModel.countDocuments).toHaveBeenCalled();
            expect(result).toBe(5);
        });
    });

    describe('findByIdAndOwner', () => {
        it('should return a job when found by id and owner', async () => {
            const jobId = new EntityId('60d5ec49e0d3f4a3c8d3e8b1');
            const ownerId = new EntityId('60d5ec49e0d3f4a3c8d3e8b2');
            mockJobModel.findOne.mockResolvedValue(jobPersistence);

            const result = await jobRepository.findByIdAndOwner(jobId, ownerId);

            expect(mockJobModel.findOne).toHaveBeenCalledWith({
                _id: jobId.toString(),
                createdBy: ownerId.toString(),
            });
            expect(mockJobAdapter.toDomain).toHaveBeenCalledWith(jobPersistence);
            expect(result).toEqual(jobDomain);
        });

        it('should return null when no job is found', async () => {
            const jobId = new EntityId('60d5ec49e0d3f4a3c8d3e8b1');
            const ownerId = new EntityId('60d5ec49e0d3f4a3c8d3e8b2');
            mockJobModel.findOne.mockResolvedValue(null);

            const result = await jobRepository.findByIdAndOwner(jobId, ownerId);

            expect(result).toBeNull();
        });
    });

    describe('listByOwner', () => {
        it('should return a list of jobs for a given owner', async () => {
            const ownerId = new EntityId('60d5ec49e0d3f4a3c8d3e8b2');
            mockJobModel.find.mockResolvedValue([jobPersistence]);

            const result = await jobRepository.listByOwner(ownerId);

            expect(mockJobModel.find).toHaveBeenCalledWith({ createdBy: ownerId.toString() });
            expect(mockJobAdapter.toDomain).toHaveBeenCalledWith(jobPersistence);
            expect(result).toEqual([jobDomain]);
        });
    });

    describe('getStats', () => {
        it('should return job stats', async () => {
            const ownerId = new EntityId('60d5ec49e0d3f4a3c8d3e8b2');
            const statsData = [
                { _id: 'pending', count: 1 },
                { _id: 'interview', count: 2 },
            ];
            const monthlyApplicationsData = [
                { _id: { year: 2025, month: 7 }, count: 3 },
                { _id: { year: 2025, month: 6 }, count: 5 },
            ];

            mockJobModel.aggregate.mockResolvedValueOnce(statsData);
            mockJobModel.aggregate.mockResolvedValueOnce(monthlyApplicationsData);

            const result = await jobRepository.getStats(ownerId);

            expect(mockJobModel.aggregate).toHaveBeenCalledTimes(2);
            expect(result.stats).toEqual({
                pending: 1,
                interview: 2,
                declined: 0,
            });
            expect(result.monthlyApplications.length).toBe(2);
        });
    });
});