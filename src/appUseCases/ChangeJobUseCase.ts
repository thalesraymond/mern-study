import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import ValidateOwnershipUseCase from "./ValidateOwnershipUseCase.js";
import { EntityId } from "../domain/entities/EntityId.js";
import NotFoundError from "../errors/NotFoundError.js";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";
import Job, { JobStatus, JobType } from "../domain/entities/Job.js";

export interface ChangeJobRequest {
    userId: string;
    jobId?: string;
    company: string;
    position: string;
    status: JobStatus;
    jobType: JobType;
    location: string;
}

export default class ChangeJobUseCase {
    private readonly validateOwnership: ValidateOwnershipUseCase;

    constructor(
        private readonly jobRepository: IJobRepository,
        private readonly userRepository: IUserRepository
    ) {
        this.validateOwnership = new ValidateOwnershipUseCase(this.userRepository);
    }

    public async execute(request: ChangeJobRequest): Promise<Job> {
        const { jobId, userId } = request;

        const user = await this.userRepository.getById(new EntityId(userId));
        if (!user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        if (jobId) {
            const existingJob = await this.jobRepository.getById(new EntityId(jobId));
            if (!existingJob) {
                throw new NotFoundError(`Job not found with id ${jobId}`);
            }

            await this.validateOwnership.execute(user.id, existingJob.createdBy.id);

            const jobToUpdate = new Job({
                ...existingJob,
                ...request,
                id: existingJob.id,
                updatedAt: new Date(),
            });

            return this.jobRepository.update(jobToUpdate);
        } else {
            const jobToCreate = new Job({
                ...request,
                createdBy: user,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            
            return this.jobRepository.create(jobToCreate);
        }
    }
}
