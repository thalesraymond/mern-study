import { body } from "express-validator";
import ValidationMiddleware from "../middleware/ValidationMiddleware.js";

export default class UserValidator {
    public static registerUserValidation =
        ValidationMiddleware.validationErrorHandler([
            body("name").notEmpty().withMessage("name is required"),
            body("lastName").notEmpty().withMessage("last name is required"),
            body("email")
                .notEmpty()
                .isEmail()
                .withMessage(
                    "email is required and must be a valid email address"
                ),
            body("password")
                .notEmpty()
                .withMessage("password is required")
                .isLength({ min: 6 })
                .withMessage("password must be at least 6 characters long"),
            body("location").notEmpty().withMessage("location is required"),
        ]);

    public static loginUserValidation =
        ValidationMiddleware.validationErrorHandler([
            body("email")
                .notEmpty()
                .isEmail()
                .withMessage(
                    "email is required and must be a valid email address"
                ),
            body("password").notEmpty().withMessage("password is required"),
        ]);
}
