import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import Job from "../domain/entities/Job.js";
import { EntityId } from "../domain/entities/EntityId.js";
import NotFoundError from "../errors/NotFoundError.js";
import UserRole from "../domain/entities/UserRole.js";

interface SearchJobsUseCasePayload {
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

export default class SearchJobsUseCase {
    constructor(
        private readonly jobRepository: IJobRepository,
        private readonly userRepository: IUserRepository
    ) {}

    public async execute({
        userId,
        search,
        jobStatus,
        jobType,
        sort,
        page,
    }: SearchJobsUseCasePayload): Promise<GetAllJobsResponse> {
        if (!page) {
            page = 1;
        }

        const pageSize = 10;

        const userEntityId = new EntityId(userId);
        const user = await this.userRepository.getById(userEntityId);

        if (!user) {
            throw new NotFoundError(`User with id ${userId} not found`);
        }

        const ownerOrAdmin = user.role === UserRole.ADMIN ? undefined : userEntityId;

        const searchResult = await this.jobRepository.listByOwner(ownerOrAdmin, {
            search,
            jobStatus,
            jobType,
            sort,
            skip: (page - 1) * pageSize,
            limit: pageSize,
        });

        return {
            jobs: searchResult.jobs,
            totalJobs: searchResult.totalJobs,
            page: searchResult.page,
            totalPages: searchResult.totalPages,
        };
    }
}
