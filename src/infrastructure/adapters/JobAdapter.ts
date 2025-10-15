import Adapter from "./Adapter.js";
import Job from "../../domain/entities/Job.js";
import UserAdapter from "./UserAdapter.js";
import UserModel, { UserSchema } from "../models/users/UserModel.js";
import NotFoundError from "../../errors/NotFoundError.js";
import { JobSchema } from "../models/jobs/JobModel.js";
import mongoose, { HydratedDocument } from "mongoose";
import { EntityId } from "../../domain/entities/EntityId.js";

export default class JobAdapter extends Adapter<Job, JobSchema> {
    public async toDomain(raw: HydratedDocument<JobSchema>): Promise<Job> {
        const createdByUser = raw.populated("createdBy")
            ? (raw.createdBy as HydratedDocument<UserSchema>)
            : await UserModel.findById(raw.createdBy);

        if (!createdByUser) {
            throw new NotFoundError(`User with id ${raw.createdBy} not found`);
        }

        return new Job({
            id: new EntityId(raw._id.toString()),
            company: raw.company,
            position: raw.position,
            status: raw.status,
            jobType: raw.jobType,
            location: raw.location,
            createdBy: new UserAdapter().toDomain(createdByUser),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }

    public toPersistence(job: Job): JobSchema {
        return {
            company: job.company,
            position: job.position,
            status: job.status,
            jobType: job.jobType,
            location: job.location,
            createdAt: job.createdAt,
            updatedAt: new Date(),
            createdBy: job.createdBy.id
                ? new mongoose.Types.ObjectId(job.createdBy.id.toString())
                : undefined,
        };
    }
}
