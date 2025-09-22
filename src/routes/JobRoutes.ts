import express from "express";
import JobController from "../controllers/JobController.js";
import JobValidator from "../validators/JobValidator.js";

const jobRoutes = express.Router();

const jobController = new JobController();

jobRoutes
  .route("/")
  .get(jobController.getAllJobs)
  .post(...JobValidator.changeJobValidation, jobController.createJob);

jobRoutes
  .route("/:id")
  .get(jobController.getJobById)
  .put(...JobValidator.changeJobValidation, jobController.updateJob)
  .delete(jobController.deleteJob);

export default jobRoutes;
