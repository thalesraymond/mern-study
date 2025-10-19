import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import Job from "../domain/entities/Job.js";
import GetSingleJobUseCase from "./GetSingleJobUseCase.js";
import SearchJobsUseCase from "./SearchJobsUseCase.js";

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
    private readonly getSingleJobUseCase: GetSingleJobUseCase;
    private readonly searchJobsUseCase: SearchJobsUseCase;

    constructor(
        private readonly jobRepository: IJobRepository,
        private readonly userRepository: IUserRepository
    ) {
        this.getSingleJobUseCase = new GetSingleJobUseCase(
            this.jobRepository,
            this.userRepository
        );
        this.searchJobsUseCase = new SearchJobsUseCase(
            this.jobRepository,
            this.userRepository
        );
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
        if (jobId) {
            return this.getSingleJobUseCase.execute({ jobId, userId });
        }

        return this.searchJobsUseCase.execute({
            userId,
            search,
            jobStatus,
            jobType,
            sort,
            page,
        });
    }
}
