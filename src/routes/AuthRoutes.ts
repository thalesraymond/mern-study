import express from "express";
import UserController from "../controllers/UserController.js";
import UserValidator from "../validators/UserValidator.js";

const authRoutes = express.Router();

const userController = new UserController();

authRoutes
    .route("/login")
    .post(UserValidator.loginUserValidation, userController.auth);

authRoutes.route("/logout").post(userController.logout);

export default authRoutes;
