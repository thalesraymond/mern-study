import { param } from "express-validator";
import ValidationMiddleware from "../middleware/ValidationMiddleware.js";
import mongoose, { Model } from "mongoose";
import BadRequestError from "../errors/BadRequestError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

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
                .custom(async (value: string, { req }) => {

                    const document = await model.findById(value);

                    if (!document) {
                        throw new BadRequestError("no document with that id");
                    }

                    const isAdmin = req.user?.role === "admin";

                    if(isAdmin) return;

                    const hasCreatedByProperty = "createdBy" in document;

                    if(!hasCreatedByProperty) return;

                    const createdByValue = (document.createdBy as mongoose.ObjectId).toString();

                    if(createdByValue !== req.user?.userId) {
                        throw new UnauthorizedError("not authorized to access this resource")
                    }
                })
                .withMessage("item with that id does not exist"),
        ]);
    }
}
