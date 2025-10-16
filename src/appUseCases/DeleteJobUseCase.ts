import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { EntityId } from "../domain/entities/EntityId.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import NotFoundError from "../errors/NotFoundError.js";
import { ValidateOwnershipUseCase } from "./ValidateOwnershipUseCase.js";

export interface DeleteJobRequest {
    jobId: string;
    userId: string;
}

export default class DeleteJobUseCase {
    private readonly validateOwnership: ValidateOwnershipUseCase;
    constructor(
        private readonly jobRepository: IJobRepository,
        private readonly userRepository: IUserRepository
    ) {
        this.validateOwnership = new ValidateOwnershipUseCase(this.userRepository);
    }

    public async execute(request: DeleteJobRequest): Promise<void> {
        const job = await this.jobRepository.getById(new EntityId(request.jobId));
        if (!job) {
            throw new NotFoundError(`Job not found with id ${request.jobId}`);
        }

        await this.validateOwnership.execute(new EntityId(request.userId), job.createdBy.id);

        await this.jobRepository.delete(new EntityId(request.jobId));
    }
}
