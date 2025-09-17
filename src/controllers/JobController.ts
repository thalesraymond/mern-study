import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import JobModel from "../models/JobModel.js";
import NotFoundError from "../errors/NotFoundError.js";
import BadRequestError from "../errors/BadRequestError.js";

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
      throw new BadRequestError("Invalid request");
    }

    const createJobResult = await JobModel.create({
      company: company,
      position,
    });

    return res.status(StatusCodes.CREATED).json(createJobResult);

  };

  public getJobById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const job = await JobModel.findById(id);

    if (!job) {
      throw new NotFoundError(`Job not found with id ${id}`);
    }

    return res.status(StatusCodes.OK).json(job);

  };

  public updateJob = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { company, position } = req.body;
    
    if (!company || !position) {

      throw new BadRequestError("Invalid request");
    }

    const jobToEdit = await JobModel.findById(id);

    if (!jobToEdit) {
      throw new NotFoundError(`Job not found with id ${id}`);
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
      throw new NotFoundError(`Job not found with id ${id}`);
    }

    await JobModel.findByIdAndDelete(id);

    return res.status(StatusCodes.NO_CONTENT).send();
  };
}
