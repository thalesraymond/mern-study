import Entity from "./Entity.js";
import JobStatus from "../../models/JobStatus.js";
import JobType from "../../models/JobType.js";

interface JobProps {
    id: string;
    company: string;
    position: string;
    status: JobStatus;
    jobType: JobType;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

export default class Job extends Entity {
    public readonly company: string;
    public readonly position: string;
    public readonly status: JobStatus;
    public readonly jobType: JobType;
    public readonly location: string;

    constructor(props: JobProps) {
        super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt });
        this.company = props.company;
        this.position = props.position;
        this.status = props.status;
        this.jobType = props.jobType;
        this.location = props.location;
    }
}
