import express from "express";
import { Request, Response } from 'express';
import morgan from "morgan";
import * as dotenv from "dotenv";
import jobRoutes from "./JobRoutes";


const app = express();

dotenv.config();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.use(jobRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send({msg: "Hello World!!"});
});

app.listen(process.env.PORT ?? 5100, () => {
    console.log("server running....");
});

app.post("/api/v1/test", (req: Request, res: Response) => {
    const {name} = req.body;
    res.json({msg: `hello ${name}!`});
});

export default app;