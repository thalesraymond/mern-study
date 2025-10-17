import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import JobController from '../../src/controllers/JobController.js';
import { IJobRepository } from '../../src/domain/repositories/IJobRepository.js';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository.js';
import ChangeJobUseCase from '../../src/appUseCases/ChangeJobUseCase.js';
import DeleteJobUseCase from '../../src/appUseCases/DeleteJobUseCase.js';
import RetrieveJobsUseCase from '../../src/appUseCases/RetrieveJobsUseCase.js';
import { JobDTO } from '../../src/domain/dtos/JobDTO.js';
import Job, { JobType } from '../../src/domain/entities/Job.js';
import { EntityId } from '../../src/domain/entities/EntityId.js';

vi.mock('../../src/appUseCases/ChangeJobUseCase.js');
vi.mock('../../src/appUseCases/DeleteJobUseCase.js');
vi.mock('../../src/appUseCases/RetrieveJobsUseCase.js');

const mockJobRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    stats: vi.fn(),
    monthlyApplications: vi.fn(),
} as unknown as IJobRepository;

const mockUserRepository = {
    create: vi.fn(),
    findByEmail: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    listAll: vi.fn(),
    count: vi.fn(),
} as unknown as IUserRepository;

const VALID_MONGO_ID = '60d5ec49e0d3f4a3c8d3e8b1';
const VALID_MONGO_ID_2 = '60d5ec49e0d3f4a3c8d3e8b2';

const jobDTO: JobDTO = {
    id: VALID_MONGO_ID,
    company: 'Google',
    position: 'Software Engineer',
    status: 'pending',
    type: 'full-time',
    location: 'Mountain View',
    createdBy: VALID_MONGO_ID_2,
};

const jobEntity = new Job({
    ...jobDTO,
    id: new EntityId(jobDTO.id),
    jobType: JobType.FULL_TIME,
    createdBy: new EntityId(VALID_MONGO_ID_2),
});

describe('JobController', () => {
    let jobController: JobController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: vi.Mock;

    beforeEach(() => {
        jobController = new JobController(mockJobRepository, mockUserRepository);
        req = {
            body: {},
            user: { userId: VALID_MONGO_ID_2, role: 'USER' },
            params: {},
            query: {},
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('createJob', () => {
        it('should return a 201 status code and the created job', async () => {
            req.body = jobDTO;
            const mockChangeJobUseCaseInstance = {
                execute: vi.fn().mockResolvedValue(jobEntity),
            };
            (ChangeJobUseCase as vi.Mock).mockImplementation(() => mockChangeJobUseCaseInstance);

            await jobController.createJob(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ job: expect.any(Object) });
        });
    });

    describe('getAllJobs', () => {
        it('should return a 200 status code and a list of jobs', async () => {
            const mockRetrieveJobsUseCaseInstance = {
                execute: vi.fn().mockResolvedValue([jobEntity]),
            };
            (RetrieveJobsUseCase as vi.Mock).mockImplementation(() => mockRetrieveJobsUseCaseInstance);

            await jobController.getAllJobs(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ jobs: expect.any(Array) });
        });
    });

    describe('updateJob', () => {
        it('should return a 200 status code and the updated job', async () => {
            req.body = { position: 'Senior Software Engineer' };
            req.params = { id: VALID_MONGO_ID };
            const mockChangeJobUseCaseInstance = {
                execute: vi.fn().mockResolvedValue(jobEntity),
            };
            (ChangeJobUseCase as vi.Mock).mockImplementation(() => mockChangeJobUseCaseInstance);

            await jobController.updateJob(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ job: expect.any(Object) });
        });
    });

    describe('deleteJob', () => {
        it('should return a 200 status code and a success message', async () => {
            req.params = { id: VALID_MONGO_ID };
            const mockDeleteJobUseCaseInstance = {
                execute: vi.fn().mockResolvedValue(undefined),
            };
            (DeleteJobUseCase as vi.Mock).mockImplementation(() => mockDeleteJobUseCaseInstance);

            await jobController.deleteJob(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Job deleted successfully' });
        });
    });

    describe('getJobById', () => {
        it('should return a 200 status code and the job', async () => {
            req.params = { id: VALID_MONGO_ID };
            const mockRetrieveJobsUseCaseInstance = {
                execute: vi.fn().mockResolvedValue(jobEntity),
            };
            (RetrieveJobsUseCase as vi.Mock).mockImplementation(() => mockRetrieveJobsUseCaseInstance);

            await jobController.getJobById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ job: expect.any(Object) });
        });
    });
});