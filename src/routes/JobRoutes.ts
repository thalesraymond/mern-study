import express from "express";
import JobController from "../controllers/JobController.js";
import JobValidator from "../validators/JobValidator.js";
import IdValidator from "../validators/IdValidator.js";

const jobRoutes = express.Router();

const jobController = new JobController();

jobRoutes
  .route("/")
  .get(jobController.getAllJobs)
  .post(...JobValidator.changeJobValidation, jobController.createJob);

jobRoutes
  .route("/:id")
  .get(...IdValidator.validateId, jobController.getJobById)
  .put(
    ...JobValidator.changeJobValidation,
    ...IdValidator.validateId,
    jobController.updateJob
  )
  .delete(...IdValidator.validateId, jobController.deleteJob);

export default jobRoutes;
