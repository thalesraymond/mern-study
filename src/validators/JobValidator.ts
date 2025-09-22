import { body, ValidationChain } from "express-validator";
import JobStatus from "../models/JobStatus.js";
import JobType from "../models/JobType.js";

export default class JobValidator {
  public static changeJobValidation: ValidationChain[] = [
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
  ];
}
