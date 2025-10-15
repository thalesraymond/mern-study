import Adapter from "./Adapter.js";
import Job from "../domain/entities/Job.js";
import { EntityId } from "../domain/entities/EntityId.js";
import UserAdapter from "./UserAdapter.js";
import UserModel from "../models/users/UserModel.js";
import NotFoundError from "../errors/NotFoundError.js";
import User from "../domain/entities/User.js";

export default class JobAdapter extends Adapter<Job> {
    public async toDomain(raw: any): Promise<Job> {
        let createdByUser: User;

        // Check if createdBy is populated
        if (raw.createdBy && typeof raw.createdBy === 'object' && 'name' in raw.createdBy) {
            const userAdapter = new UserAdapter();
            createdByUser = userAdapter.toDomain(raw.createdBy);
        } else {
            const userId = raw.createdBy?.toString();
            if (!userId) {
                throw new Error("createdBy field is missing or invalid");
            }
            const userDoc = await UserModel.findById(userId);
            if (!userDoc) {
                throw new NotFoundError(`User not found with id ${userId}`);
            }
            const userAdapter = new UserAdapter();
            createdByUser = userAdapter.toDomain(userDoc.toObject());
        }

        return new Job({
            id: new EntityId(raw.id || raw._id.toString()),
            company: raw.company,
            position: raw.position,
            status: raw.status,
            jobType: raw.jobType,
            location: raw.location,
            createdBy: createdByUser,
        });
    }

    public toPersistence(job: Job): any {
        return {
            _id: job.id?.toString(),
            company: job.company,
            position: job.position,
            status: job.status,
            jobType: job.jobType,
            location: job.location,
            createdBy: job.createdBy.id?.toString(),
        };
    }
}
