import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/NotFoundError.js";
import { JobPayload, JobParams } from "../requests/JobRequest.js";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { EntityId } from "../domain/entities/EntityId.js";
import Job, { JobStatus, JobType } from "../domain/entities/Job.js";
import CreateJobUseCase from "../appUseCases/CreateJobUseCase.js";
import UpdateJobUseCase from "../appUseCases/UpdateJobUseCase.js";

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

    public getAllJobs = async (req: Request<{}, {}, {}>, res: Response<{ jobs: JobPayload[] }>) => {
        const jobs = await this.jobRepository.listAll();
        const jobPayloads = jobs.map((job) => this.toJobPayload(job));
        return res.status(StatusCodes.OK).json({ jobs: jobPayloads });
    };

    public createJob = async (req: Request<{}, {}, JobPayload>, res: Response<{ job: JobPayload }>) => {
        if (!req.user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        const useCase = new CreateJobUseCase(this.jobRepository, this.userRepository);
        const job = await useCase.execute({
            ...req.body,
            status: req.body.status as JobStatus,
            jobType: req.body.jobType as JobType,
            createdBy: req.user.userId,
        });

        return res.status(StatusCodes.CREATED).json({
            job: this.toJobPayload(job),
        });
    };

    public getJobById = async (req: Request<JobParams>, res: Response<{ job: JobPayload }>) => {
        const { id } = req.params;
        const job = await this.jobRepository.getById(new EntityId(id));

        if (!job) {
            throw new NotFoundError(`Job not found with id ${id}`);
        }

        return res.status(StatusCodes.OK).json({
            job: this.toJobPayload(job),
        });
    };

    public updateJob = async (req: Request<JobParams, {}, Partial<JobPayload>>, res: Response<{ job: JobPayload }>) => {
        const { id } = req.params;
        const useCase = new UpdateJobUseCase(this.jobRepository);
        const updatedJob = await useCase.execute({
            ...req.body,
            id,
            status: req.body.status as JobStatus,
            jobType: req.body.jobType as JobType,
        });

        return res.status(StatusCodes.OK).json({
            job: this.toJobPayload(updatedJob),
        });
    };

    public deleteJob = async (req: Request<JobParams>, res: Response<{ msg: string }>) => {
        const { id } = req.params;
        await this.jobRepository.delete(new EntityId(id));
        return res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
    };
}