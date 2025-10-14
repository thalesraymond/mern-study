import { body } from "express-validator";
import ValidationMiddleware from "../middleware/ValidationMiddleware.js";
import { Request } from "express";
import UserModel from "../models/users/UserModel.js";
import BadRequestError from "../errors/BadRequestError.js";

export default class UserValidator {
    public static registerUserValidation() {
        return ValidationMiddleware.validationErrorHandler([
            body("name").notEmpty().withMessage("name is required"),
            body("lastName").notEmpty().withMessage("last name is required"),
            body("email")
                .notEmpty()
                .isEmail()
                .withMessage(
                    "email is required and must be a valid email address"
                )
                .custom(async (email) => {
                    const isDuplicated = await UserModel.exists({ email });

                    if (isDuplicated) {
                        throw new BadRequestError("email already registered");
                    }
                }),
            body("password")
                .notEmpty()
                .withMessage("password is required")
                .isLength({ min: 6 })
                .withMessage("password must be at least 6 characters long"),
            body("location").notEmpty().withMessage("location is required"),
        ]);
    }

    public static updateUserValidation() {
        return ValidationMiddleware.validationErrorHandler([
            body("name").notEmpty().withMessage("name is required"),
            body("lastName").notEmpty().withMessage("last name is required"),
            body("email")
                .notEmpty()
                .isEmail()
                .withMessage(
                    "email is required and must be a valid email address"
                )
                .custom(async (email: string, { req }) => {
                    const userId = (req as Request).user?.userId;

                    const isDuplicated = await UserModel.exists({
                        email,
                        _id: { $ne: userId },
                    });

                    if (isDuplicated) {
                        throw new BadRequestError("email already registered");
                    }
                }),
            body("password")
                .isEmpty()
                .withMessage("password cannot be updated"),
            body("location").notEmpty().withMessage("location is required"),
        ]);
    }

    public static loginUserValidation() {
        return ValidationMiddleware.validationErrorHandler([
            body("email")
                .notEmpty()
                .isEmail()
                .withMessage(
                    "email is required and must be a valid email address"
                ),
            body("password").notEmpty().withMessage("password is required"),
        ]);
    }
}
