export interface JobPayload {
    id: string;
    company: string;
    position: string;
    status: string;
    jobType: string;
    location: string;
    createdBy: string;
}

export interface JobParams {
    id: string;
}
