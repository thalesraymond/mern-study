import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import jobRoutes from "./routes/JobRoutes.js";
import { StatusCodes } from "http-status-codes";

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

app.use((err: any, _req: any, res: any) => {
  console.log(err);

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Something went wrong" });
});

app.listen(process.env.PORT ?? 5100, () => {
  console.log("server running....");
});

export default app;
