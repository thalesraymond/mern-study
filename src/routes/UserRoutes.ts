import express from "express";
import UserController from "../controllers/UserController.js";
import UserValidator from "../validators/UserValidator.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import TokenManager from "../infrastructure/security/TokenManager.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export default (
    userRepository: IUserRepository,
    jobRepository: IJobRepository
) => {
    const userRoutes = express.Router();
    const userController = new UserController(userRepository, jobRepository);
    const authMiddleware = new AuthMiddleware(new TokenManager());

    userRoutes
        .route("/")
        .get(authMiddleware.authenticateUser, userController.getCurrentUser)
        .patch(
            authMiddleware.authenticateUser,
            upload.single("avatar"),
            UserValidator.updateUserValidation(),
            userController.updateUser
        );

    userRoutes
        .route("/stats")
        .get(
            authMiddleware.authenticateUser,
            authMiddleware.authorizePermissions("admin"),
            userController.getAppStats
        );

    return userRoutes;
};
