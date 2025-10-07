import { param } from "express-validator";
import ValidationMiddleware from "../middleware/ValidationMiddleware.js";
import mongoose, { Model } from "mongoose";
import BadRequestError from "../errors/BadRequestError.js";

export default class IdValidator {
    public static validateId() {
        return ValidationMiddleware.validationErrorHandler([
            param("id")
                .custom((value: string) => {
                    return mongoose.Types.ObjectId.isValid(value);
                })
                .withMessage("invalid id"),
        ]);
    }

    public static validateExistingId<T>(model: Model<T>) {
        return ValidationMiddleware.validationErrorHandler([
            param("id")
                .custom(async (value: string) => {
                    const document = await model.findById(value);

                    if (!document) {
                        throw new BadRequestError("no document with that id");
                    }
                })
                .withMessage("item with that id does not exist"),
        ]);
    }
}
