import { JobStatus } from "../../domain/entities/Job.js";

export interface StatsDto {
    stats: Record<JobStatus, number>;
    monthlyApplications: {
        date: string;
        count: number;
    }[];
}
