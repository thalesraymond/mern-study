import User from "./User";

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

export default class Job {
    private readonly company: string;
    private readonly position: string;
    private readonly status: JobStatus;
    private readonly jobType: JobType;
    private readonly location: string;
    private readonly createdBy: User;

    constructor(
        company: string,
        position: string,
        status: JobStatus,
        jobType: JobType,
        location: string,
        createdBy: User
    ) {
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
    }

    public getCompany(): string {
        return this.company;
    }

    public getPosition(): string {
        return this.position;
    }

    public getStatus(): JobStatus {
        return this.status;
    }

    public getJobType(): JobType {
        return this.jobType;
    }

    public getLocation(): string {
        return this.location;
    }

    public getCreatedBy(): User {
        return this.createdBy;
    }
}
