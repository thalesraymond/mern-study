import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

// routes
import jobRoutes from "./routes/JobRoutes.js";
import registerRoutes from "./routes/RegisterRoutes.js";
import ErrorHandlerMiddleware from "./middleware/ErrorHandlerMiddleware.js";
import authRoutes from "./routes/AuthRoutes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/UserRoutes.js";
// end routes

import UserRepository from "./infrastructure/repositories/UserRepository.js";
import JobRepository from "./infrastructure/repositories/JobRepository.js";
import path from "path";

const app = express();

dotenv.config();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.use(cookieParser());

// Instantiate repositories
const userRepository = new UserRepository();
const jobRepository = new JobRepository();

app.use(express.static("./client/dist"));

app.get("/", (req, res) => {
    res.sendFile(path.join("./client/dist", "index.html"));
});

app.use("/api/v1/test", (req, res) => {
    return res.status(StatusCodes.OK).json({ msg: "test" });
});

app.use("/api/v1/auth", authRoutes(userRepository, jobRepository));

app.use("/api/v1/register", registerRoutes(userRepository, jobRepository));

app.use("/api/v1/jobs", jobRoutes(jobRepository, userRepository));

app.use("/api/v1/user", userRoutes(userRepository, jobRepository));

app.use((_req, res) => {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Not Found" });
});

app.use(ErrorHandlerMiddleware.errorHandler);

try {
    if (!process.env.MONGO_CONNECTION_STRING) {
        throw new Error("MONGO_CONNECTION_STRING is not defined");
    }

    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

    app.listen(process.env.PORT ?? 5100, () => {
        console.log("server running....");
    });
} catch (error) {
    console.log(error);
}

export default app;
