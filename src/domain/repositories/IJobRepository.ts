import Job from "../entities/Job.js";
import { IRepository } from "./IRepository.js";
import { EntityId } from "../entities/EntityId.js";

import { StatsDto } from "../../appUseCases/dtos/StatsDto.js";

export interface IJobRepository extends IRepository<Job> {
    count(): Promise<number>;
    findByIdAndOwner(id: EntityId, ownerId: EntityId): Promise<Job | null>;
    listByOwner(ownerId?: EntityId, options?: { search?: string; jobStatus?: string; jobType?: string; sort?: string; }): Promise<Job[]>;
    getStats(ownerId: EntityId): Promise<StatsDto>;
}
