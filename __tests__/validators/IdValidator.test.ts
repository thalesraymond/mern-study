import { describe, it, expect, vi, beforeEach } from "vitest";
import { param } from "express-validator";
import IdValidator from "../../src/validators/IdValidator.js";
import mongoose from "mongoose";
import BadRequestError from "../../src/errors/BadRequestError.js";
import UnauthorizedError from "../../src/errors/UnauthorizedError.js";

// The chainable object for express-validator mocks
const validatorChain = {
    custom: vi.fn().mockReturnThis(),
    withMessage: vi.fn().mockReturnThis(),
    notEmpty: vi.fn().mockReturnThis(),
    isEmail: vi.fn().mockReturnThis(),
    isIn: vi.fn().mockReturnThis(),
    isLength: vi.fn().mockReturnThis(),
    isEmpty: vi.fn().mockReturnThis(),
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

describe("IdValidator", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mocks on the chain object as well
        Object.values(validatorChain).forEach(mockFn => mockFn.mockClear());
    });

    describe("validateId", () => {
        it("should return a validation chain for a valid id", () => {
            IdValidator.validateId();
            expect(param).toHaveBeenCalledWith("id");
            expect(validatorChain.custom).toHaveBeenCalled();

            const customValidator = (validatorChain.custom.mock.calls[0][0]) as (value: string) => boolean;
            const validId = new mongoose.Types.ObjectId().toString();
            expect(customValidator(validId)).toBe(true);
            const invalidId = "123";
            expect(customValidator(invalidId)).toBe(false);
        });
    });

    describe("validateExistingId", () => {
        it("should return a validation chain that checks for document existence and ownership", async () => {
            const mockModel = {
                findById: vi.fn(),
            };

            IdValidator.validateExistingId(mockModel as any);
            expect(param).toHaveBeenCalledWith("id");
            expect(validatorChain.custom).toHaveBeenCalled();

            const customValidator = (validatorChain.custom.mock.calls[0][0]) as (value: string, { req }: any) => Promise<void>;
            const validId = new mongoose.Types.ObjectId().toString();
            const userId = new mongoose.Types.ObjectId().toString();

            const mockReq = {
                user: {
                    userId: userId,
                    role: "user",
                },
            };

            // Test case 1: Document does not exist
            mockModel.findById.mockResolvedValue(null);
            await expect(customValidator(validId, { req: mockReq })).rejects.toThrow(new BadRequestError("no document with that id"));

            // Test case 2: Document exists and user is owner
            const doc = { _id: validId, createdBy: new mongoose.Types.ObjectId(userId) };
            mockModel.findById.mockResolvedValue(doc);
            await expect(customValidator(validId, { req: mockReq })).resolves.not.toThrow();

            // Test case 3: User is not owner
            const otherUserId = new mongoose.Types.ObjectId().toString();
            const doc2 = { _id: validId, createdBy: new mongoose.Types.ObjectId(otherUserId) };
            mockModel.findById.mockResolvedValue(doc2);
            await expect(customValidator(validId, { req: mockReq })).rejects.toThrow(new UnauthorizedError("not authorized to access this resource"));

            // Test case 4: User is admin
            const adminReq = {
                user: {
                    userId: new mongoose.Types.ObjectId().toString(),
                    role: "admin",
                },
            };
            mockModel.findById.mockResolvedValue(doc2); // a doc they don't own
            await expect(customValidator(validId, { req: adminReq })).resolves.not.toThrow();

            // Test case 5: Document has no 'createdBy' property
            const doc3 = { _id: validId };
            mockModel.findById.mockResolvedValue(doc3);
            await expect(customValidator(validId, { req: mockReq })).resolves.not.toThrow();
        });
    });
});