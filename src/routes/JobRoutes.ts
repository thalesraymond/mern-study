import express from "express";
import JobController from "../controllers/JobController.js";
import JobValidator from "../validators/JobValidator.js";
import IdValidator from "../validators/IdValidator.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import TokenManager from "../infrastructure/security/TokenManager.js";

export default (
    jobRepository: IJobRepository,
    userRepository: IUserRepository
) => {
    const jobRoutes = express.Router();
    const jobController = new JobController(jobRepository, userRepository);
    const authMiddleware = new AuthMiddleware(new TokenManager());

    jobRoutes
        .route("/")
        .get(authMiddleware.authenticateUser, jobController.getAllJobs)
        .post(
            authMiddleware.authenticateUser,
            JobValidator.changeJobValidation(),
            jobController.createJob
        );

    jobRoutes.route("/stats").get(authMiddleware.authenticateUser, jobController.showStats);


    jobRoutes
        .route("/:id")
        .get(
            authMiddleware.authenticateUser,
            IdValidator.validateId(),
            jobController.getJobById
        )
        .put(
            authMiddleware.authenticateUser,
            JobValidator.changeJobValidation(),
            IdValidator.validateId(),
            jobController.updateJob
        )
        .delete(
            authMiddleware.authenticateUser,
            IdValidator.validateId(),
            jobController.deleteJob
        );

    return jobRoutes;
};