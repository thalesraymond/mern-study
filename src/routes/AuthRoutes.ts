import express from "express";
import UserController from "../controllers/UserController.js";
import UserValidator from "../validators/UserValidator.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";

export default (
    userRepository: IUserRepository,
    jobRepository: IJobRepository
) => {
    const authRoutes = express.Router();
    const userController = new UserController(userRepository, jobRepository);

    authRoutes
        .route("/login")
        .post(UserValidator.loginUserValidation(), userController.auth);

    authRoutes.route("/logout").post(userController.logout);

    return authRoutes;
};
