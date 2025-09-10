import mangoose from "mongoose";
import JobStatus from "./JobStatus.js";
import JobType from "./JobType.js";

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

const jobSchema = new mangoose.Schema<JobSchema>({
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
}, { timestamps: true });

export default mangoose.model("Job", jobSchema);
