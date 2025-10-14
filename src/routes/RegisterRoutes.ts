import express from "express";
import UserController from "../controllers/UserController.js";
import UserValidator from "../validators/UserValidator.js";

const registerRoutes = express.Router();

const userController = new UserController();

registerRoutes
    .route("/")
    .post(UserValidator.registerUserValidation(), userController.register);

export default registerRoutes;
