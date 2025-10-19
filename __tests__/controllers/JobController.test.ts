import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { Request, Response } from "express";
import JobController from "../../src/controllers/JobController.js";
import { IJobRepository } from "../../src/domain/repositories/IJobRepository.js";
import { IUserRepository } from "../../src/domain/repositories/IUserRepository.js";
import ChangeJobUseCase from "../../src/appUseCases/ChangeJobUseCase.js";
import DeleteJobUseCase from "../../src/appUseCases/DeleteJobUseCase.js";
import RetrieveJobsUseCase from "../../src/appUseCases/RetrieveJobsUseCase.js";
import Job, { JobType, JobStatus } from "../../src/domain/entities/Job.js";
import { EntityId } from "../../src/domain/entities/EntityId.js";
import User from "../../src/domain/entities/User.js";
import Email from "../../src/domain/entities/Email.js";
import UserPassword from "../../src/domain/entities/UserPassword.js";
import UserRole from "../../src/domain/entities/UserRole.js";
import { JobParams, JobPayload } from "../../src/requests/JobRequest.js";

import GetJobStatsUseCase from "../../src/appUseCases/GetJobStatsUseCase.js";

vi.mock("../../src/appUseCases/ChangeJobUseCase.js");
vi.mock("../../src/appUseCases/DeleteJobUseCase.js");
vi.mock("../../src/appUseCases/RetrieveJobsUseCase.js");
vi.mock("../../src/appUseCases/GetJobStatsUseCase.js");

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

const VALID_MONGO_ID = "60d5ec49e0d3f4a3c8d3e8b1";
const VALID_MONGO_ID_2 = "60d5ec49e0d3f4a3c8d3e8b2";

const jobDTO = {
    id: VALID_MONGO_ID,
    company: "Google",
    position: "Software Engineer",
    status: "pending",
    type: "full-time",
    location: "Mountain View",
    createdBy: VALID_MONGO_ID_2,
};

const user = new User({
    id: new EntityId(VALID_MONGO_ID_2),
    name: "Test",
    lastName: "User",
    email: Email.create("test@example.com"),
    password: UserPassword.createFromHashed("hashedPassword"),
    role: UserRole.USER,
    location: "Test Location",
    createdAt: new Date(),
    updatedAt: new Date(),
});

const jobEntity = new Job({
    id: new EntityId(jobDTO.id),
    company: jobDTO.company,
    position: jobDTO.position,
    status: JobStatus.PENDING,
    jobType: JobType.FULL_TIME,
    location: jobDTO.location,
    createdBy: user,
    createdAt: new Date(),
    updatedAt: new Date(),
});

describe("JobController", () => {
    let jobController: JobController;
    let req: Request;
    let res: Partial<Response>;

    beforeEach(() => {
        jobController = new JobController(mockJobRepository, mockUserRepository);
        req = {
            body: {},
            user: { userId: VALID_MONGO_ID_2, role: "USER" },
            params: {},
            query: {},
        } as Request;
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        vi.clearAllMocks();
    });

    describe("createJob", () => {
        it("should return a 201 status code and the created job", async () => {
            req.body = jobDTO;
            const mockChangeJobUseCaseInstance = {
                execute: vi.fn().mockResolvedValue(jobEntity),
            };
            (ChangeJobUseCase as Mock).mockImplementation(() => mockChangeJobUseCaseInstance);

            await jobController.createJob(req, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ job: expect.any(Object) });
        });
    });

    describe("getAllJobs", () => {
        it("should return a 200 status code and a list of jobs", async () => {
            const mockRetrieveJobsUseCaseInstance = {
                execute: vi.fn().mockResolvedValue([jobEntity]),
            };
            (RetrieveJobsUseCase as Mock).mockImplementation(() => mockRetrieveJobsUseCaseInstance);

            await jobController.getAllJobs(req, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ jobs: expect.any(Array) });
        });
    });

    describe("updateJob", () => {
        it("should return a 200 status code and the updated job", async () => {
            req.body = { position: "Senior Software Engineer" };
            req.params = { id: VALID_MONGO_ID } as JobParams as any;
            const mockChangeJobUseCaseInstance = {
                execute: vi.fn().mockResolvedValue(jobEntity),
            };
            (ChangeJobUseCase as Mock).mockImplementation(() => mockChangeJobUseCaseInstance);

            await jobController.updateJob(req as any as Request<JobParams, {}, Partial<JobPayload>>, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ job: expect.any(Object) });
        });
    });

    describe("deleteJob", () => {
        it("should return a 200 status code and a success message", async () => {
            req.params = { id: VALID_MONGO_ID } as JobParams as any;
            const mockDeleteJobUseCaseInstance = {
                execute: vi.fn().mockResolvedValue(undefined),
            };
            (DeleteJobUseCase as Mock).mockImplementation(() => mockDeleteJobUseCaseInstance);

            await jobController.deleteJob(req as any as Request<JobParams>, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Job deleted successfully" });
        });
    });

    describe("getJobById", () => {
        it("should return a 200 status code and the job", async () => {
            req.params = { id: VALID_MONGO_ID } as JobParams as any;
            const mockRetrieveJobsUseCaseInstance = {
                execute: vi.fn().mockResolvedValue(jobEntity),
            };
            (RetrieveJobsUseCase as Mock).mockImplementation(() => mockRetrieveJobsUseCaseInstance);

            await jobController.getJobById(req as any as Request<JobParams>, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ job: expect.any(Object) });
        });
    });

    describe("showStats", () => {
        it("should return a 200 status code and the stats", async () => {
            const mockGetJobStatsUseCaseInstance = {
                execute: vi.fn().mockResolvedValue({ stats: {}, monthlyApplications: [] }),
            };
            (GetJobStatsUseCase as Mock).mockImplementation(() => mockGetJobStatsUseCaseInstance);

            await jobController.showStats(req, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ defaultStats: {}, monthlyApplications: [] });
        });
    });

    describe("Unauthenticated access", () => {
        beforeEach(() => {
            req.user = undefined;
        });

        it("getAllJobs should throw UnauthenticatedError", async () => {
            await expect(jobController.getAllJobs(req, res as Response)).rejects.toThrow("Authentication Invalid");
        });

        it("createJob should throw UnauthenticatedError", async () => {
            await expect(jobController.createJob(req, res as Response)).rejects.toThrow("Authentication Invalid");
        });

        it("getJobById should throw UnauthenticatedError", async () => {
            req.params = { id: VALID_MONGO_ID } as JobParams as any;
            await expect(jobController.getJobById(req as any as Request<JobParams>, res as Response)).rejects.toThrow(
                "Authentication Invalid"
            );
        });

        it("updateJob should throw UnauthenticatedError", async () => {
            req.params = { id: VALID_MONGO_ID } as JobParams as any;
            await expect(
                jobController.updateJob(req as any as Request<JobParams, {}, Partial<JobPayload>>, res as Response)
            ).rejects.toThrow("Authentication Invalid");
        });

        it("showStats should throw UnauthenticatedError", async () => {
            await expect(jobController.showStats(req, res as Response)).rejects.toThrow("Authentication Invalid");
        });

        it("deleteJob should throw UnauthenticatedError", async () => {
            req.params = { id: VALID_MONGO_ID } as JobParams as any;
            await expect(jobController.deleteJob(req as any as Request<JobParams>, res as Response)).rejects.toThrow(
                "Authentication Invalid"
            );
        });
    });
});
