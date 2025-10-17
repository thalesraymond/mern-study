import { describe, it, expect, vi, beforeEach } from "vitest";
import { body } from "express-validator";
import UserValidator from "../../src/validators/UserValidator.js";
import UserModel from "../../src/infrastructure/models/users/UserModel.js";
import BadRequestError from "../../src/errors/BadRequestError.js";

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

vi.mock("../../src/infrastructure/models/users/UserModel.js", () => ({
    default: {
        exists: vi.fn(),
    },
}));

describe("UserValidator", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.values(validatorChain).forEach(mockFn => mockFn.mockClear());
        (UserModel.exists as vi.Mock).mockClear();
    });

    describe("registerUserValidation", () => {
        it("should return a validation chain for user registration", async () => {
            UserValidator.registerUserValidation();

            expect(body).toHaveBeenCalledWith("name");
            expect(body).toHaveBeenCalledWith("lastName");
            expect(body).toHaveBeenCalledWith("email");
            expect(body).toHaveBeenCalledWith("password");
            expect(body).toHaveBeenCalledWith("location");

            expect(validatorChain.notEmpty).toHaveBeenCalledTimes(5);
            expect(validatorChain.isEmail).toHaveBeenCalledTimes(1);
            expect(validatorChain.isLength).toHaveBeenCalledWith({ min: 6 });
            expect(validatorChain.custom).toHaveBeenCalledTimes(1);

            const emailValidator = (validatorChain.custom.mock.calls[0][0]) as (email: string) => Promise<void>;

            (UserModel.exists as vi.Mock).mockResolvedValue(null);
            await expect(emailValidator("test@test.com")).resolves.not.toThrow();

            (UserModel.exists as vi.Mock).mockResolvedValue({ _id: "someid" });
            await expect(emailValidator("test@test.com")).rejects.toThrow(new BadRequestError("email already registered"));
        });
    });

    describe("updateUserValidation", () => {
        it("should return a validation chain for updating a user", async () => {
            UserValidator.updateUserValidation();

            expect(body).toHaveBeenCalledWith("name");
            expect(body).toHaveBeenCalledWith("lastName");
            expect(body).toHaveBeenCalledWith("email");
            expect(body).toHaveBeenCalledWith("password");
            expect(body).toHaveBeenCalledWith("location");

            expect(validatorChain.notEmpty).toHaveBeenCalledTimes(4);
            expect(validatorChain.isEmail).toHaveBeenCalledTimes(1);
            expect(validatorChain.isEmpty).toHaveBeenCalledTimes(1);
            expect(validatorChain.custom).toHaveBeenCalledTimes(1);

            const emailValidator = (validatorChain.custom.mock.calls[0][0]) as (email: string, { req }: any) => Promise<void>;
            const mockReq = { user: { userId: "123" } };

            (UserModel.exists as vi.Mock).mockResolvedValue(null);
            await expect(emailValidator("test@test.com", { req: mockReq })).resolves.not.toThrow();

            (UserModel.exists as vi.Mock).mockResolvedValue({ _id: "someotherid" });
            await expect(emailValidator("test@test.com", { req: mockReq })).rejects.toThrow(new BadRequestError("email already registered"));
            expect(UserModel.exists).toHaveBeenCalledWith({ email: "test@test.com", _id: { $ne: "123" } });
        });
    });

    describe("loginUserValidation", () => {
        it("should return a validation chain for user login", () => {
            UserValidator.loginUserValidation();

            expect(body).toHaveBeenCalledWith("email");
            expect(body).toHaveBeenCalledWith("password");
            expect(validatorChain.notEmpty).toHaveBeenCalledTimes(2);
            expect(validatorChain.isEmail).toHaveBeenCalledTimes(1);
        });
    });
});