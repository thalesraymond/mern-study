import express from "express";
import UserController from "../controllers/UserController.js";
import UserValidator from "../validators/UserValidator.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";

export default (
    userRepository: IUserRepository,
    jobRepository: IJobRepository
) => {
    const userRoutes = express.Router();
    const userController = new UserController(userRepository, jobRepository);

    userRoutes
        .route("/")
        .get(userController.getCurrentUser)
        .patch(UserValidator.updateUserValidation(), userController.updateUser);

    userRoutes
        .route("/stats")
        .get(
            AuthMiddleware.authorizePermissions("admin"),
            userController.getAppStats
        );

    return userRoutes;
};
