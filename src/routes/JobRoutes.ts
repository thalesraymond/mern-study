import express from "express";
import JobController from "../controllers/JobController.js";
import JobValidator from "../validators/JobValidator.js";
import IdValidator from "../validators/IdValidator.js";
import JobModel from "../models/jobs/JobModel.js";

const jobRoutes = express.Router();

const jobController = new JobController();

jobRoutes
    .route("/")
    .get(jobController.getAllJobs)
    .post(...JobValidator.changeJobValidation, jobController.createJob);

jobRoutes
    .route("/:id")
    .get(...IdValidator.validateId(), jobController.getJobById)
    .put(
        ...JobValidator.changeJobValidation,
        ...IdValidator.validateExistingId(JobModel),
        jobController.updateJob
    )
    .delete(
        ...IdValidator.validateId(),
        ...IdValidator.validateExistingId(JobModel),
        jobController.deleteJob
    );

export default jobRoutes;
