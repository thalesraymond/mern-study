import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import JobModel from "../models/JobModel.js";
import NotFoundError from "../errors/NotFoundError.js";
import BadRequestError from "../errors/BadRequestError.js";
import { body, validationResult } from "express-validator";
import JobStatus from "../models/JobStatus.js";
import JobType from "../models/JobType.js";

export const validateJobInput = [
  body("company").notEmpty().withMessage("company is required"),
  body("position").notEmpty().withMessage("position is required"),
  body("status")
    .optional()
    .isIn(Object.values(JobStatus))
    .withMessage("invalid status value"),
  body("jobType")
    .optional()
    .isIn(Object.values(JobType))
    .withMessage("invalid job type"),
];

export default class JobController {
  public getAllJobs = async (req: Request, res: Response) => {
    const jobs = await JobModel.find();
    return res.status(StatusCodes.OK).json({ jobs });
  };

  public createJob = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new BadRequestError(errorMessages.join(", "));
    }

    const job = await JobModel.create(req.body);
    return res.status(StatusCodes.CREATED).json({ job });
  };

  public getJobById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const job = await JobModel.findById(id);

    if (!job) {
      throw new NotFoundError(`Job not found with id ${id}`);
    }

    return res.status(StatusCodes.OK).json({ job });
  };

  public updateJob = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new BadRequestError(errorMessages.join(", "));
    }

    const { id } = req.params;

    const updatedJob = await JobModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedJob) {
      throw new NotFoundError(`Job not found with id ${id}`);
    }

    return res.status(StatusCodes.OK).json({ job: updatedJob });
  };

  public deleteJob = async (req: Request, res: Response) => {
    const { id } = req.params;
    const removedJob = await JobModel.findByIdAndDelete(id);

    if (!removedJob) {
      throw new NotFoundError(`Job not found with id ${id}`);
    }

    return res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
  };
}
