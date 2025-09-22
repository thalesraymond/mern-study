import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

// routes

import jobRoutes from "./routes/JobRoutes.js";
import ErrorHandlerMiddleware from "./middleware/ErrorHandlerMiddleware.js";

// end routes

const app = express();

dotenv.config();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/jobs", jobRoutes);

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
