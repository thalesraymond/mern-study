import mangoose from "mongoose";
import JobStatus from "./JobStatus.js";
import JobType from "./JobType.js";

/**
 * Represents a job entry with company, position, status, type, and location details.
 *
 * @property id - Unique identifier for the job.
 * @property company - Name of the company offering the job.
 * @property position - Title or role of the job.
 * @property status - Current status of the job (e.g., applied, interviewing, etc.).
 * @property jobType - Type of the job (e.g., full-time, part-time, contract).
 * @property location - Location where the job is based.
 * @property createdAt - Date when the job entry was created.
 * @property updatedAt - Date when the job entry was last updated.
 */
interface JobSchema {
    id: string;
    company: string;
    position: string;
    status: JobStatus;
    jobType: JobType;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

const jobSchema = new mangoose.Schema<JobSchema>(
    {
        company: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(JobStatus),
            default: JobStatus.PENDING,
        },
        jobType: {
            type: String,
            enum: Object.values(JobType),
            default: JobType.FULL_TIME,
        },
        location: {
            type: String,
            default: "Remote",
            required: true,
        },
    },
    { timestamps: true }
);

export default mangoose.model("Job", jobSchema);
