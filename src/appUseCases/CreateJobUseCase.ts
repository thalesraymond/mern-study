import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { EntityId } from "../domain/entities/EntityId.js";
import Job, { JobStatus, JobType } from "../domain/entities/Job.js";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";

interface CreateJobRequest {
    company: string;
    position: string;
    location: string;
    status: JobStatus;
    jobType: JobType;
    createdBy: string;
}

export default class CreateJobUseCase {
    constructor(
        private jobRepository: IJobRepository,
        private userRepository: IUserRepository
    ) {}

    public async execute(request: CreateJobRequest): Promise<Job> {
        const createdBy = await this.userRepository.getById(new EntityId(request.createdBy));
        if (!createdBy) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        const jobToCreate = new Job({
            company: request.company,
            position: request.position,
            location: request.location,
            status: request.status,
            jobType: request.jobType,
            createdBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return this.jobRepository.create(jobToCreate);
    }
}