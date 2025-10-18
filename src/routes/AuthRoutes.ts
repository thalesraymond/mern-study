import express from "express";
import UserController from "../controllers/UserController.js";
import UserValidator from "../validators/UserValidator.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IStorageService } from "../domain/services/IStorageService.js";

export default (userRepository: IUserRepository, jobRepository: IJobRepository, storageService: IStorageService) => {
    const authRoutes = express.Router();
    const userController = new UserController(userRepository, jobRepository, storageService);

    authRoutes.route("/login").post(UserValidator.loginUserValidation(), userController.auth);

    authRoutes.route("/logout").get(userController.logout);

    return authRoutes;
};
