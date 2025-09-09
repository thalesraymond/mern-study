import express from "express";
import JobController from "../controllers/JobController.js";

const jobRoutes = express.Router();

const jobController = new JobController();

jobRoutes
  .route("/")
  .get(jobController.getAllJobs)
  .post(jobController.createJob);

jobRoutes
  .route("/:id")
  .get(jobController.getJobById)
  .put(jobController.updateJob)
  .delete(jobController.deleteJob);

export default jobRoutes;
