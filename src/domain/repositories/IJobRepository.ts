import Job from "../entities/Job.js";
import { IRepository } from "./IRepository.js";

export interface IJobRepository extends IRepository<Job> {
    count(): Promise<number>;
}
