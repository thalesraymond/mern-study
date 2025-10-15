import express from "express";
import UserController from "../controllers/UserController.js";
import UserValidator from "../validators/UserValidator.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";

export default (
    userRepository: IUserRepository,
    jobRepository: IJobRepository
) => {
    const registerRoutes = express.Router();
    const userController = new UserController(userRepository, jobRepository);

    registerRoutes
        .route("/")
        .post(UserValidator.registerUserValidation(), userController.register);

    return registerRoutes;
};
