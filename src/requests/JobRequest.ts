export interface JobPayload {
    id: string;
    company: string;
    position: string;
    status: string;
    jobType: string;
    location: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}

export interface SearchJobsPayload {
    jobs: JobPayload[];
    totalJobs: number;
    page: number;
    totalPages: number;
}

export interface JobParams {
    id: string;
}
