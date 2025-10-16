import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import Job from "../domain/entities/Job.js";
import { EntityId } from "../domain/entities/EntityId.js";
import ValidateOwnershipUseCase from "./ValidateOwnershipUseCase.js";
import NotFoundError from "../errors/NotFoundError.js";
import UserRole from "../domain/entities/UserRole.js";

interface RetrieveJobsUseCasePayload {
    jobId?: string;
    userId: string;
}

export default class RetrieveJobsUseCase {
    private readonly ownershipUseCase: ValidateOwnershipUseCase;
    constructor(
        private readonly jobRepository: IJobRepository,
        private readonly userRepository: IUserRepository
    ) {
        this.ownershipUseCase = new ValidateOwnershipUseCase(this.userRepository);
    }

    public async execute({ jobId, userId }: RetrieveJobsUseCasePayload): Promise<Job | Job[]> {
        const userEntityId = new EntityId(userId);
        const user = await this.userRepository.getById(userEntityId);

        if (!user) {
            throw new NotFoundError(`User with id ${userId} not found`);
        }

        if (jobId) {
            const jobEntityId = new EntityId(jobId);
            const job = await this.jobRepository.getById(jobEntityId);

            if (!job) {
                throw new NotFoundError(`Job with id ${jobId} not found`);
            }

            await this.ownershipUseCase.execute(user.id, job.createdBy.id as EntityId);

            return job;
        }

        if (user.role === UserRole.ADMIN) {
            return await this.jobRepository.listAll();
        }

        return await this.jobRepository.listByOwner(userEntityId);
    }
}
