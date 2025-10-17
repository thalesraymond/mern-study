import { describe, it, expect, vi, beforeEach } from "vitest";
import { body } from "express-validator";
import JobValidator from "../../src/validators/JobValidator.js";
import JobStatus from "../../src/infrastructure/models/jobs/JobStatus.js";
import JobType from "../../src/infrastructure/models/jobs/JobType.js";

const validatorChain = {
    custom: vi.fn().mockReturnThis(),
    withMessage: vi.fn().mockReturnThis(),
    notEmpty: vi.fn().mockReturnThis(),
    isEmail: vi.fn().mockReturnThis(),
    isIn: vi.fn().mockReturnThis(),
    isLength: vi.fn().mockReturnThis(),
    isEmpty: vi.fn().mockReturnThis(),
    optional: vi.fn().mockReturnThis(),
};

vi.mock("express-validator", () => ({
    param: vi.fn(() => validatorChain),
    body: vi.fn(() => validatorChain),
}));

vi.mock("../../src/middleware/ValidationMiddleware.js", () => ({
    default: {
        validationErrorHandler: vi.fn((x) => x),
    },
}));

describe("JobValidator", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.values(validatorChain).forEach(mockFn => mockFn.mockClear());
    });

    describe("changeJobValidation", () => {
        it("should return a validation chain for changing a job", () => {
            JobValidator.changeJobValidation();

            expect(body).toHaveBeenCalledWith("company");
            expect(validatorChain.notEmpty).toHaveBeenCalled();

            expect(body).toHaveBeenCalledWith("position");
            expect(validatorChain.notEmpty).toHaveBeenCalled();

            expect(body).toHaveBeenCalledWith("status");
            expect(validatorChain.optional).toHaveBeenCalled();
            expect(validatorChain.isIn).toHaveBeenCalledWith(Object.values(JobStatus));

            expect(body).toHaveBeenCalledWith("jobType");
            expect(validatorChain.optional).toHaveBeenCalled();
            expect(validatorChain.isIn).toHaveBeenCalledWith(Object.values(JobType));
        });
    });
});