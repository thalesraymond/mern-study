import express from "express";
import JobController, { validateJobInput } from "../controllers/JobController.js";

const jobRoutes = express.Router();

const jobController = new JobController();

jobRoutes
  .route("/")
  .get(jobController.getAllJobs)
  .post(validateJobInput, jobController.createJob);

jobRoutes
  .route("/:id")
  .get(jobController.getJobById)
  .put(validateJobInput,jobController.updateJob)
  .delete(jobController.deleteJob);

export default jobRoutes;
