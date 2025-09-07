import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import nanoid from "nanoid";
import {STATUS_CODES} from "node:http";
import {StatusCodes} from "http-status-codes";

const jobs = [
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

const app = express();

dotenv.config();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
    res.send({msg: "Hello World!!"});
});

app.listen(process.env.PORT ?? 5100, () => {
    console.log("server running....");
});

app.post("/api/v1/test", (req, res) => {
    const {name} = req.body;
    res.json({msg: `hello ${name}!`});
});


// GET Jobs
app.get("/api/v1/jobs", (req, res) => {
    res.status(StatusCodes.OK).json({jobs});
});

// POST Create Job
app.post("/api/v1/jobs", (req, res) => {

    const {company, position} = req.body;

    if (!company || !position) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: "Invalid request"});
    }

    const id = nanoid();
    const job = {id, company, position};

    jobs.push(job);

    res.status(StatusCodes.CREATED).json({job});
});

app.get("/api/v1/jobs/:id", (req, res) => {
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