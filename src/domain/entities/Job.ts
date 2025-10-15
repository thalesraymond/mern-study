import { Entity } from "./Entity.js";
import User from "./User.js";
import { EntityId } from "./EntityId.js";

export enum JobStatus {
    INTERVIEW = "interview",
    DECLINED = "declined",
    PENDING = "pending",
}

export enum JobType {
    FULL_TIME = "full-time",
    PART_TIME = "part-time",
    CONTRACT = "contract",
    INTERNSHIP = "internship",
}

export default class Job extends Entity {
    public readonly company: string;
    public readonly position: string;
    public readonly status: JobStatus;
    public readonly jobType: JobType;
    public readonly location: string;
    public readonly createdBy: User;

    constructor({
        company,
        position,
        status,
        jobType,
        location,
        createdBy,
        id,
        createdAt,
        updatedAt,
    }: {
        company: string;
        position: string;
        status: JobStatus;
        jobType: JobType;
        location: string;
        createdBy: User;
        id?: EntityId;
        createdAt: Date;
        updatedAt: Date;
    }) {
        super({
            id,
            createdAt,
            updatedAt,
        });
        this.company = company;
        this.position = position;
        this.status = status;
        this.jobType = jobType;
        this.location = location;
        this.createdBy = createdBy;
        this.validate();
    }

    private validate(): void {
        if (!this.company || this.company.trim() === "") {
            throw new Error("company is required");
        }
        if (!this.position || this.position.trim() === "") {
            throw new Error("position is required");
        }
        if (!this.location || this.location.trim() === "") {
            throw new Error("location is required");
        }
        if (!this.createdBy) {
            throw new Error("createdBy is required");
        }
        if (!this.status) {
            throw new Error("status is required");
        }
        if (!this.jobType) {
            throw new Error("jobType is required");
        }
    }
}
