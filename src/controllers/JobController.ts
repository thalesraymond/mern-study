import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import JobRepository from "../infrastructure/repositories/JobRepository.js";

export default class JobController {
  private jobRepository = new JobRepository();

  public getAllJobs = async (req: Request, res: Response) => {
    const jobs = await this.jobRepository.findAll();
    res.status(StatusCodes.OK).json({ jobs });
  };

  public createJob = async (req: Request, res: Response) => {
    const { company, position, location, jobType, status } = req.body;

    if (!company || !position) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Company and position are required" });
    }

    const jobData = { company, position, location, jobType, status };

    const job = await this.jobRepository.create(jobData);

    res.status(StatusCodes.CREATED).json({ job });
  };

  public getJobById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const job = await this.jobRepository.findById(id);

    if (job) {
      return res.status(StatusCodes.OK).json(job);
    }

    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found" });
  };

  public updateJob = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { company, position, location, jobType, status } = req.body;

    if (!company || !position) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Company and position are required" });
    }

    const jobData = { company, position, location, jobType, status };

    const updatedJob = await this.jobRepository.update(id, jobData);

    if (!updatedJob) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found" });
    }

    return res.status(StatusCodes.OK).json(updatedJob);
  };

  public deleteJob = async (req: Request, res: Response) => {
    const { id } = req.params;
    const success = await this.jobRepository.delete(id);

    if (success) {
      return res.status(StatusCodes.NO_CONTENT).send();
    }

    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found" });
  };
}
