import { IJobRepository } from "../../domain/repositories/IJobRepository.js";
import Job from "../../domain/entities/Job.js";
import Repository from "./Repository.js";
import JobModel, { JobSchema } from "../models/jobs/JobModel.js";
import JobAdapter from "../adapters/JobAdapter.js";
import { EntityId } from "../../domain/entities/EntityId.js";

export default class JobRepository extends Repository<Job, JobSchema> implements IJobRepository {
    constructor() {
        super(JobModel, new JobAdapter());
    }

    async count(): Promise<number> {
        return this.model.countDocuments();
    }

    async findByIdAndOwner(id: EntityId, ownerId: EntityId): Promise<Job | null> {
        const job = await this.model.findOne({ _id: id.toString(), createdBy: ownerId.toString() });
        return job ? await this.adapter.toDomain(job) : null;
    }

    async listByOwner(ownerId: EntityId): Promise<Job[]> {
        const jobs = await this.model.find({ createdBy: ownerId.toString() });

        return Promise.all(jobs.map((job) => this.adapter.toDomain(job)));
    }
}
