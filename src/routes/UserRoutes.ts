import express from "express";
import UserController from "../controllers/UserController.js";
import UserValidator from "../validators/UserValidator.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const userRoutes = express.Router();

const userController = new UserController();

userRoutes
    .route("/")
    .get(userController.getCurrentUser)
    .patch(UserValidator.updateUserValidation(), userController.updateUser);

userRoutes
    .route("/stats").get(AuthMiddleware.authorizePermissions("admin"), userController.getAppStats)


export default userRoutes;
