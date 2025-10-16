import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { EntityId } from "../domain/entities/EntityId.js";
import Job, { JobStatus, JobType } from "../domain/entities/Job.js";
import NotFoundError from "../errors/NotFoundError.js";

interface UpdateJobRequest {
    id: string;
    company?: string;
    position?: string;
    location?: string;
    status?: JobStatus;
    jobType?: JobType;
}

export default class UpdateJobUseCase {
    constructor(private jobRepository: IJobRepository) {}

    public async execute(request: UpdateJobRequest): Promise<Job> {
        const existingJob = await this.jobRepository.getById(new EntityId(request.id));
        if (!existingJob) {
            throw new NotFoundError(`Job not found with id ${request.id}`);
        }

        const jobToUpdate = new Job({
            id: existingJob.id,
            company: request.company ?? existingJob.company,
            position: request.position ?? existingJob.position,
            location: request.location ?? existingJob.location,
            status: request.status ?? existingJob.status,
            jobType: request.jobType ?? existingJob.jobType,
            createdBy: existingJob.createdBy,
            createdAt: existingJob.createdAt,
            updatedAt: new Date(),
        });

        return this.jobRepository.update(jobToUpdate);
    }
}