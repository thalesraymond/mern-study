import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import JobModel from "../models/JobModel.js";

export default class JobController {
  public getAllJobs = async (req: Request, res: Response) => {
    // list all jobs using JobModel

    try {
      const jobs = await JobModel.find();

      return res.status(StatusCodes.OK).json(jobs);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: "Internal server error",
        error: error,
      });
    }
  };

  public createJob = async (req: Request, res: Response) => {
    const { company, position } = req.body;

    if (!company || !position) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid request" });
    }

    try {
      const createJobResult = await JobModel.create({
        company: company,
        position,
      });

      return res.status(StatusCodes.CREATED).json(createJobResult);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Internal server error", error: error });
    }
  };

  public getJobById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const job = await JobModel.findById(id);

      if (!job) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found" });
      }

      return res.status(StatusCodes.OK).json(job);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: "Internal server error",
        error: error,
      });
    }
  };

  public updateJob = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { company, position } = req.body;
    
    if (!company || !position) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid request" });
    }

    const jobToEdit = await JobModel.findById(id);

    if (!jobToEdit) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found" });
    }

    jobToEdit.company = company;
    jobToEdit.position = position;

    await JobModel.findByIdAndUpdate(id, jobToEdit);

    return res.status(StatusCodes.OK).json(jobToEdit);
  };

  public deleteJob = async (req: Request, res: Response) => {
    const { id } = req.params;
    const foundJob = await JobModel.findById(id);

    if (!foundJob) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found" });
    }

    try {
      await JobModel.findByIdAndDelete(id);

      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: "Internal server error",
        error: error,
      });
    }
  };
}
