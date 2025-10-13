import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import JobModel from "../models/jobs/JobModel.js";
import NotFoundError from "../errors/NotFoundError.js";
import { JobPayload, JobParams } from "../requests/JobRequest.js";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";

/**
 * Controller class for handling job-related operations.
 *
 * Provides methods for CRUD operations on jobs, including:
 * - Retrieving all jobs
 * - Creating a new job
 * - Retrieving a job by its ID
 * - Updating an existing job
 * - Deleting a job
 *
 * Each method is designed to be used as an Express route handler and returns appropriate HTTP status codes and JSON responses.
 *
 * @class JobController
 */
export default class JobController {
    public getAllJobs = async (
        req: Request<{}, {}, {}>,
        res: Response<{ jobs: JobPayload[] }>
    ) => {
        if (!req.user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }
        console.log("req.user: ", req.user);
        const jobs = await JobModel.find({ createdBy: req.user.userId });

        return res.status(StatusCodes.OK).json({ jobs });
    };

    public createJob = async (
        req: Request<{}, {}, JobPayload>,
        res: Response<{ job: JobPayload }>
    ) => {
        if (!req.user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        const jobToCreate = { ...req.body, createdBy: req.user?.userId };

        const job = await JobModel.create(jobToCreate);

        return res.status(StatusCodes.CREATED).json({ job });
    };

    public getJobById = async (
        req: Request<JobParams>,
        res: Response<{ job: JobPayload }>
    ) => {
        const { id } = req.params;

        const job: JobPayload | null = await JobModel.findById(id);

        if (!job) {
            throw new NotFoundError(`Job not found with id ${id}`);
        }

        return res.status(StatusCodes.OK).json({ job });
    };

    public updateJob = async (
        req: Request<JobParams, {}, JobPayload>,
        res: Response<{ job: JobPayload }>
    ) => {
        const { id } = req.params;

        const jobToUpdate = { ...req.body, updatedBy: req.user?.userId };

        const updatedJob = await JobModel.findByIdAndUpdate(id, jobToUpdate, {
            new: true,
        });

        if (!updatedJob) {
            throw new NotFoundError(`Job not found with id ${id}`);
        }

        return res.status(StatusCodes.OK).json({ job: updatedJob });
    };

    public deleteJob = async (
        req: Request<JobParams>,
        res: Response<{ msg: string }>
    ) => {
        const { id } = req.params;

        await JobModel.findByIdAndDelete(id);

        return res
            .status(StatusCodes.OK)
            .json({ msg: "Job deleted successfully" });
    };
}
