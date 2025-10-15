import { IJobRepository } from '../../domain/repositories/IJobRepository.js';
import Job from '../../domain/entities/Job.js';
import Repository from './Repository.js';
import JobModel from '../../models/jobs/JobModel.js';
import JobAdapter from '../../adapters/JobAdapter.js';

export default class JobRepository extends Repository<Job> implements IJobRepository {
    constructor() {
        super(JobModel, new JobAdapter());
    }

    async count(): Promise<number> {
        return this.model.countDocuments();
    }
}
