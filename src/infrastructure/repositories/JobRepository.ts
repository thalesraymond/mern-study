import { IJobRepository } from "../../domain/repositories/IJobRepository.js";
import Job from "../../domain/entities/Job.js";
import Repository from "./Repository.js";
import JobModel, { JobSchema } from "../models/jobs/JobModel.js";
import JobAdapter from "../adapters/JobAdapter.js";
import { EntityId } from "../../domain/entities/EntityId.js";

import moment from "moment";
import mongoose from "mongoose";
import { SortOptions } from "../../appUseCases/types.js";
import { StatsDto } from "../../appUseCases/dtos/StatsDto.js";
import { JobStatus } from "../../domain/entities/Job.js";

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



    async listByOwner(ownerId: EntityId, options?: { search?: string; jobStatus?: string; jobType?: string; sort?: string; }): Promise<Job[]> {
        const queryObject: any = {
            createdBy: ownerId.toString(),
        };

        if (options?.search) {
            queryObject.$or = [
                { position: { $regex: options.search, $options: "i" } },
                { company: { $regex: options.search, $options: "i" } },
            ];
        }

        if (options?.jobStatus && options.jobStatus !== "all") {
            queryObject.status = options.jobStatus;
        }

        if (options?.jobType && options.jobType !== "all") {
            queryObject.jobType = options.jobType;
        }

        const sortOptions: any = {};
        switch (options?.sort) {
            case SortOptions.NEWEST:
                sortOptions.createdAt = -1;
                break;
            case SortOptions.OLDEST:
                sortOptions.createdAt = 1;
                break;
            case SortOptions.A_Z:
                sortOptions.position = 1;
                break;
            case SortOptions.Z_A:
                sortOptions.position = -1;
                break;
            default:
                sortOptions.createdAt = -1;
                break;
        }

        const jobs = await this.model.find(queryObject).sort(sortOptions);

        return Promise.all(jobs.map((job) => this.adapter.toDomain(job)));
    }

    async getStats(ownerId: EntityId): Promise<StatsDto> {
        let statsArray = await this.model.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(ownerId.toString()) } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const stats = statsArray.reduce((acc, curr) => {
            const { _id: title, count } = curr;
            acc[title] = count;
            return acc;
        }, {} as Record<JobStatus, number>);

        const defaultStats = {
            [JobStatus.PENDING]: stats.pending || 0,
            [JobStatus.INTERVIEW]: stats.interview || 0,
            [JobStatus.DECLINED]: stats.declined || 0,
        };

        let monthlyApplications = await this.model.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(ownerId.toString()) } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 6 },
        ]);

        monthlyApplications = monthlyApplications
            .map((item) => {
                const {
                    _id: { year, month },
                    count,
                } = item;

                const date = moment()
                    .month(month - 1)
                    .year(year)
                    .format("MMM Y");
                return { date, count };
            })
            .reverse();

        return {
            stats: defaultStats,
            monthlyApplications,
        };
    }
}
