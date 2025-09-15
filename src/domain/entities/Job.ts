import Entity from "./Entity.js";
import JobStatus from "../../models/JobStatus.js";
import JobType from "../../models/JobType.js";

export default class Job extends Entity {
    public company: string;
    public position: string;
    public status: JobStatus;
    public jobType: JobType;
    public location: string;
}
