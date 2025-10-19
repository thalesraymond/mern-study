import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { EntityId } from "../domain/entities/EntityId.js";
import NotFoundError from "../errors/NotFoundError.js";
import { StatsDto } from "./dtos/StatsDto.js";

export default class GetJobStatsUseCase {
    constructor(
        private readonly jobRepository: IJobRepository,
        private readonly userRepository: IUserRepository
    ) {}

    public async execute(userId: string): Promise<StatsDto> {
        const user = await this.userRepository.getById(new EntityId(userId));
        if (!user) {
            throw new NotFoundError(`User with id ${userId} not found`);
        }

        return this.jobRepository.getStats(user.id);
    }
}
