import { param } from "express-validator";
import ValidationMiddleware from "../middleware/ValidationMiddleware.js";

export default class IdValidator {
  public static validateId = ValidationMiddleware.validationErrorHandler([
    param("id")
      .custom((value: string) => {
        if (value && !value.match(/^[0-9a-fA-F]{24}$/)) {
          return false;
        }

        return true;
      })
      .withMessage("invalid id")
  ]);
}
