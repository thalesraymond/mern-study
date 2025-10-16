import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/NotFoundError.js";
import { JobPayload, JobParams } from "../requests/JobRequest.js";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { EntityId } from "../domain/entities/EntityId.js";
import Job, { JobStatus, JobType } from "../domain/entities/Job.js";
import DeleteJobUseCase from "../appUseCases/DeleteJobUseCase.js";

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

        const createdBy = await this.userRepository.getById(new EntityId(req.user.userId));
        if (!createdBy) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        const jobToCreate = new Job({
            company: req.body.company,
            position: req.body.position,
            location: req.body.location,
            status: req.body.status as JobStatus,
            jobType: req.body.jobType as JobType,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy,
        });
        const job = await this.jobRepository.create(jobToCreate);

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

        const existingJob = await this.jobRepository.getById(new EntityId(id));
        if (!existingJob) {
            throw new NotFoundError(`Job not found with id ${id}`);
        }

        const jobToUpdate = new Job({
            company: req.body.company ?? existingJob.company,
            position: req.body.position ?? existingJob.position,
            location: req.body.location ?? existingJob.location,
            status: (req.body.status ?? existingJob.status) as JobStatus,
            jobType: (req.body.jobType ?? existingJob.jobType) as JobType,
            createdBy: existingJob.createdBy,
            createdAt: existingJob.createdAt,
            updatedAt: new Date(),
            id: existingJob.id,
        });

        const updatedJob = await this.jobRepository.update(jobToUpdate);

        return res.status(StatusCodes.OK).json({
            job: this.toJobPayload(updatedJob),
        });
    };

    public deleteJob = async (req: Request<JobParams>, res: Response<{ msg: string }>) => {
        const useCase = new DeleteJobUseCase(
            this.jobRepository,
            this.userRepository
        );

        await useCase.execute({
            jobId: req.params.id,
            userId: req.user?.userId ?? "",
        });

        return res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
    };
}
