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
    search?: string;
    jobStatus?: string;
    jobType?: string;
    sort?: string;
    page?: number;
}

interface GetAllJobsResponse {
    jobs: Job[];
    totalJobs: number;
    page: number;
    totalPages: number;
}

export default class RetrieveJobsUseCase {
    private readonly ownershipUseCase: ValidateOwnershipUseCase;
    constructor(
        private readonly jobRepository: IJobRepository,
        private readonly userRepository: IUserRepository
    ) {
        this.ownershipUseCase = new ValidateOwnershipUseCase(this.userRepository);
    }

    public async execute({
        jobId,
        userId,
        search,
        jobStatus,
        jobType,
        sort,
        page,
    }: RetrieveJobsUseCasePayload): Promise<Job | GetAllJobsResponse> {
        if (!page) {
            page = 1;
        }

        const pageSize = 10;

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

        const searchResult = await this.jobRepository.listByOwner(
            user.role === UserRole.ADMIN ? undefined : userEntityId,
            {
                search,
                jobStatus,
                jobType,
                sort,
                skip: (page - 1) * pageSize,
                limit: pageSize,
            }
        );

        return {
            jobs: searchResult.jobs,
            totalJobs: searchResult.totalJobs,
            page: searchResult.page,
            totalPages: searchResult.totalPages,
        };
    }
}
