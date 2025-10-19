import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JobPayload, JobParams } from "../requests/JobRequest.js";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import Job, { JobStatus, JobType } from "../domain/entities/Job.js";
import DeleteJobUseCase from "../appUseCases/DeleteJobUseCase.js";
import ChangeJobUseCase from "../appUseCases/ChangeJobUseCase.js";
import RetrieveJobsUseCase from "../appUseCases/RetrieveJobsUseCase.js";

import GetJobStatsUseCase from "../appUseCases/GetJobStatsUseCase.js";

export default class JobController {
    constructor(
        private readonly jobRepository: IJobRepository,
        private readonly userRepository: IUserRepository
    ) {}

    private toJobPayload(job: Job): JobPayload {
        return {
            id: job.id.toString(),
            company: job.company,
            position: job.position,
            status: job.status,
            jobType: job.jobType,
            location: job.location,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
            createdBy: job.createdBy.id?.toString(),
        };
    }

    public getAllJobs = async (req: Request, res: Response<{ jobs: JobPayload[] }>) => {
        if (!req.user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        const { search, jobStatus, jobType, sort, page } = req.query;

        const useCase = new RetrieveJobsUseCase(this.jobRepository, this.userRepository);

        const searchResult = await useCase.execute({
            userId: req.user.userId,
            search: search as string,
            jobStatus: jobStatus as string,
            jobType: jobType as string,
            sort: sort as string,
            page: Number(page),
        }) as {
            jobs: Job[];
            totalJobs: number;
            page: number;
            totalPages: number;
        };

        const jobPayloads = searchResult.jobs.map((job) => this.toJobPayload(job));

        return res.status(StatusCodes.OK).json({ jobs: jobPayloads });
    };

    public createJob = async (req: Request<{}, {}, JobPayload>, res: Response<{ job: JobPayload }>) => {
        if (!req.user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        const useCase = new ChangeJobUseCase(this.jobRepository, this.userRepository);
        const job = await useCase.execute({
            ...req.body,
            status: req.body.status as JobStatus,
            jobType: req.body.jobType as JobType,

            userId: req.user.userId,
        });

        return res.status(StatusCodes.CREATED).json({
            job: this.toJobPayload(job),
        });
    };

    public getJobById = async (req: Request<JobParams>, res: Response<{ job: JobPayload }>) => {
        const { id } = req.params;
        if (!req.user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        const useCase = new RetrieveJobsUseCase(this.jobRepository, this.userRepository);

        const job = (await useCase.execute({ userId: req.user.userId, jobId: id })) as Job;

        return res.status(StatusCodes.OK).json({
            job: this.toJobPayload(job),
        });
    };

    public updateJob = async (req: Request<JobParams, {}, Partial<JobPayload>>, res: Response<{ job: JobPayload }>) => {
        const { id } = req.params;
        if (!req.user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        const useCase = new ChangeJobUseCase(this.jobRepository, this.userRepository);
        const job = await useCase.execute({
            ...req.body,
            jobId: id,
            userId: req.user.userId,
            company: req.body.company ?? "",
            position: req.body.position ?? "",
            status: (req.body.status ?? "") as JobStatus,
            jobType: (req.body.jobType ?? "") as JobType,
            location: req.body.location ?? "",
        });

        return res.status(StatusCodes.OK).json({
            job: this.toJobPayload(job),
        });
    };

    public deleteJob = async (req: Request<JobParams>, res: Response<{ msg: string }>) => {
        if (!req.user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }
        const useCase = new DeleteJobUseCase(this.jobRepository, this.userRepository);

        await useCase.execute({
            jobId: req.params.id,
            userId: req.user?.userId ?? "",
        });

        return res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
    };

    public showStats = async (req: Request, res: Response) => {
        if (!req.user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        const useCase = new GetJobStatsUseCase(this.jobRepository, this.userRepository);
        const { stats, monthlyApplications } = await useCase.execute(req.user.userId);

        return res.status(StatusCodes.OK).json({ defaultStats: stats, monthlyApplications });
    };
}
