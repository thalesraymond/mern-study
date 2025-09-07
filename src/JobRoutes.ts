
// GET Jobs
import {StatusCodes} from "http-status-codes";
import nanoid from "nanoid";
import express, {Request, Response} from "express";

const jobRoutes = express.Router();

let jobs = [
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
    }
]

jobRoutes.get("/api/v1/jobs", (req, res) => {
    res.status(StatusCodes.OK).json({jobs});
});

// POST Create Job
jobRoutes.post("/api/v1/jobs", (req, res) => {

    const {company, position} = req.body;

    if (!company || !position) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: "Invalid request"});
    }

    const id = nanoid();
    const job = {id, company, position};

    jobs.push(job);

    res.status(StatusCodes.CREATED).json({job});
});

jobRoutes.get("/api/v1/jobs/:id", (req: Request, res: Response) => {
    const {id} = req.params;

    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: "Invalid request"});
    }

    const foundJob = jobs.find(job => job.id === id);

    if(foundJob) {
        return res.status(StatusCodes.OK).json(jobs.find(job => job.id === id));
    }

    return res.status(StatusCodes.NOT_FOUND).json({msg: "Job not found"});
});

jobRoutes.put("/api/v1/jobs/:id", (req: Request, res: Response) => {
    const {id} = req.params

    const {company, position} = req.body;
    if (!id || !company || !position) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: "Invalid request"});
    }

    const jobToEdit = jobs.find(job => job.id === id);

    if (!jobToEdit) {
        return res.status(StatusCodes.NOT_FOUND).json({msg: "Job not found"});
    }

    jobToEdit.company = company;
    jobToEdit.position = position;

    return res.status(StatusCodes.OK).json(jobToEdit);
});

jobRoutes.delete("/api/v1/jobs/:id", (req: Request, res: Response) => {
    const {id} = req.params;

    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: "Invalid request"});
    }

    const foundJob = jobs.find(job => job.id === id);

    if(foundJob) {
        jobs = jobs.filter(job => job.id !== id);

        return res.status(StatusCodes.NO_CONTENT).send();
    }

    return res.status(StatusCodes.NOT_FOUND).json({msg: "Job not found"});
});

export default jobRoutes;