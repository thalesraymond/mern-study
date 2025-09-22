import { Request } from "express";

export interface JobBody {
  id: string;
  company: string;
  position: string;
  status: string;
  jobType: string;
  location: string;
}

export interface JobParams {
  id: string;
}

export interface JobRequest extends Request<JobParams, any, JobBody> {}
