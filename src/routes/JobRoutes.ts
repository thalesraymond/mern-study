import express from "express";
import JobController from "../controllers/JobController.js";
import JobValidator from "../validators/JobValidator.js";
import IdValidator from "../validators/IdValidator.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";

export default (
    jobRepository: IJobRepository,
    userRepository: IUserRepository
) => {
    const jobRoutes = express.Router();
    const jobController = new JobController(jobRepository, userRepository);

    jobRoutes
        .route("/")
        .get(jobController.getAllJobs)
        .post(JobValidator.changeJobValidation(), jobController.createJob);

    jobRoutes
        .route("/:id")
        .get(IdValidator.validateId(), jobController.getJobById)
        .put(
            JobValidator.changeJobValidation(),
            IdValidator.validateId(),
            jobController.updateJob
        )
        .delete(
            IdValidator.validateId(),
            jobController.deleteJob
        );

    return jobRoutes;
};
