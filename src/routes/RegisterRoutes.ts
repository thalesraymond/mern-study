import express from "express";
import UserController from "../controllers/UserController.js";
import UserValidator from "../validators/UserValidator.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { IJobRepository } from "../domain/repositories/IJobRepository.js";
import { IStorageService } from "../domain/services/IStorageService.js";

export default (userRepository: IUserRepository, jobRepository: IJobRepository, storageService: IStorageService) => {
    const registerRoutes = express.Router();
    const userController = new UserController(userRepository, jobRepository, storageService);

    registerRoutes.route("/").post(UserValidator.registerUserValidation(), userController.register);

    return registerRoutes;
};
