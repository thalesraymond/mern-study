import { body } from "express-validator";
import JobStatus from "../models/jobs/JobStatus.js";
import JobType from "../models/jobs/JobType.js";
import ValidationMiddleware from "../middleware/ValidationMiddleware.js";

/**
 * Provides validation middleware for job-related requests.
 *
 * @remarks
 * The `JobValidator` class contains static methods for validating job data in HTTP requests.
 *
 * @example
 * // Usage in an Express route
 * router.post('/jobs', JobValidator.changeJobValidation(), jobController.createJob);
 */
export default class JobValidator {
    public static changeJobValidation() {
        return ValidationMiddleware.validationErrorHandler([
            body("company").notEmpty().withMessage("company is required"),
            body("position").notEmpty().withMessage("position is required"),
            body("status")
                .optional()
                .isIn(Object.values(JobStatus))
                .withMessage("invalid status value"),
            body("jobType")
                .optional()
                .isIn(Object.values(JobType))
                .withMessage("invalid job type"),
        ]);
    }
}
