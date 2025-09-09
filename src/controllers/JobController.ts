import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import nanoid from "nanoid";

interface Job {
  id: string;
  company: string;
  position: string;
}

export default class JobController {
  private jobs: Job[] = [
    {
      id: nanoid(),
      company: "Google",
      position: "Software Engineer",
    },
    {
      id: nanoid(),
      company: "Microsoft",
      position: "Software Engineer",
    },
    {
      id: nanoid(),
      company: "Amazon",
      position: "Software Engineer",
    },
  ];

  public getAllJobs = (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ jobs: this.jobs });
  };

  public createJob = (req: Request, res: Response) => {
    const { company, position } = req.body;

    if (!company || !position) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid request" });
    }

    const id = nanoid();
    const job: Job = { id, company, position };

    this.jobs.push(job);

    res.status(StatusCodes.CREATED).json({ job });
  };

  public getJobById = (req: Request, res: Response) => {
    const { id } = req.params;
    const foundJob = this.jobs.find((job) => job.id === id);

    if (foundJob) {
      return res.status(StatusCodes.OK).json(foundJob);
    }

    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found" });
  };

  public updateJob = (req: Request, res: Response) => {
    const { id } = req.params;

    const { company, position } = req.body;
    if (!company || !position) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid request" });
    }

    const jobToEdit = this.jobs.find((job) => job.id === id);

    if (!jobToEdit) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found" });
    }

    jobToEdit.company = company;
    jobToEdit.position = position;

    return res.status(StatusCodes.OK).json(jobToEdit);
  };

  public deleteJob = (req: Request, res: Response) => {
    const { id } = req.params;
    const foundJob = this.jobs.find((job) => job.id === id);

    if (foundJob) {
      this.jobs = this.jobs.filter((job) => job.id !== id);
      return res.status(StatusCodes.NO_CONTENT).send();
    }

    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found" });
  };
}
