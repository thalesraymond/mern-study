import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import BadRequestError from "../errors/BadRequestError.js";

/**
 * Middleware class for handling validation errors in Express routes.
 *
 * @remarks
 * This class provides a static method to compose an array of validation middlewares
 * (such as those from `express-validator`) with a custom error handler. If validation
 * fails, it throws a `BadRequestError` containing all error messages.
 *
 * @example
 * ```typescript
 * app.post(
 *   '/endpoint',
 *   ValidationMiddleware.validationErrorHandler([
 *     body('email').isEmail(),
 *     body('password').isLength({ min: 6 }),
 *   ]),
 *   controllerFunction
 * );
 * ```
 */
export default class ValidationMiddleware {
  public static validationErrorHandler(validations: ValidationChain[]) {
    return [
      ...validations,
      (request: Request, response: Response, next: NextFunction) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
          const errorMessages = errors.array().map((error) => error.msg);

          throw new BadRequestError(errorMessages.join(", "));
        }
        next();
      },
    ];
  }
}
