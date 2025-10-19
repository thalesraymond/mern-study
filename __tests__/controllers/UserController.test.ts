import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { Request, Response } from "express";
import UserController from "../../src/controllers/UserController.js";
import { IUserRepository } from "../../src/domain/repositories/IUserRepository.js";
import { IJobRepository } from "../../src/domain/repositories/IJobRepository.js";
import RegisterUserUseCase from "../../src/appUseCases/RegisterUserUseCase.js";
import LoginUserUseCase from "../../src/appUseCases/LoginUserUseCase.js";
import { UserPayload } from "../../src/requests/UserRequest.js";
import User from "../../src/domain/entities/User.js";
import { EntityId } from "../../src/domain/entities/EntityId.js";
import Email from "../../src/domain/entities/Email.js";
import UserPassword from "../../src/domain/entities/UserPassword.js";
import UserRole from "../../src/domain/entities/UserRole.js";
import { IStorageService } from "../../src/domain/services/IStorageService.js";

vi.mock("../../src/appUseCases/RegisterUserUseCase.js");
vi.mock("../../src/appUseCases/LoginUserUseCase.js");

const mockUserRepository = {
    create: vi.fn(),
    findByEmail: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    listAll: vi.fn(),
    count: vi.fn(),
    updateProfileImage: vi.fn(),
} as unknown as IUserRepository;

const mockJobRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
} as unknown as IJobRepository;

const mockStorageService = {
    uploadFile: vi.fn(),
    deleteFile: vi.fn(),
    getFile: vi.fn(),
} as unknown as IStorageService;

const VALID_MONGO_ID = "60d5ec49e0d3f4a3c8d3e8b1";

describe("UserController", () => {
    let userController: UserController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userController = new UserController(mockUserRepository, mockJobRepository, mockStorageService);
        req = {
            body: {},
            user: { userId: VALID_MONGO_ID, role: "USER" },
        } as any;
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn(),
        };
        vi.clearAllMocks();
    });

    describe("register", () => {
        it("should return a 201 status code and user data on successful registration", async () => {
            const userData: UserPayload = {
                name: "Test",
                lastName: "User",
                email: "test@example.com",
                password: "password",
                location: "Test Location",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const userDTO = {
                name: "Test",
                lastName: "User",
                email: "test@example.com",
                role: "USER",
                location: "Test Location",
            };
            req.body = userData;

            const mockRegisterUserUseCaseInstance = {
                execute: vi.fn().mockResolvedValue(userDTO),
            };
            (RegisterUserUseCase as Mock).mockImplementation(() => mockRegisterUserUseCaseInstance);

            await userController.register(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ user: userDTO });
        });
    });

    describe("auth", () => {
        it("should return a 200 status code and success message on successful login", async () => {
            const loginData = { email: "test@example.com", password: "password" };
            req.body = loginData;

            const mockLoginUserUseCaseInstance = {
                execute: vi.fn().mockResolvedValue({ token: "some-token" }),
            };
            (LoginUserUseCase as Mock).mockImplementation(() => mockLoginUserUseCaseInstance);

            await userController.auth(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "User logged in successfully" });
            expect(res.cookie).toHaveBeenCalledWith("token", "some-token", expect.any(Object));
        });
    });

    describe("logout", () => {
        it("should return a 200 status code and success message on logout", async () => {
            await userController.logout(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "User logged out" });
            expect(res.cookie).toHaveBeenCalledWith("token", "", expect.any(Object));
        });
    });

    describe("getCurrentUser", () => {
        it("should return a 200 status code and user data", async () => {
            const user = new User({
                id: new EntityId(VALID_MONGO_ID),
                name: "Test",
                lastName: "User",
                email: Email.create("test@example.com"),
                password: UserPassword.createFromHashed("hashedPassword"),
                role: UserRole.USER,
                location: "Test Location",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            (mockUserRepository.getById as Mock).mockResolvedValue(user);

            await userController.getCurrentUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                user: {
                    id: VALID_MONGO_ID,
                    name: "Test",
                    lastName: "User",
                    email: "test@example.com",
                    location: "Test Location",
                    role: "user",
                },
            });
        });
    });

    describe("updateUser", () => {
        it("should return a 204 status code on successful update without a file", async () => {
            const user = new User({
                id: new EntityId(VALID_MONGO_ID),
                name: "Test",
                lastName: "User",
                email: Email.create("test@example.com"),
                password: UserPassword.createFromHashed("hashedPassword"),
                role: UserRole.USER,
                location: "Test Location",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            req.body = { name: "Updated Name", lastName: "Last Name", location: "Updated Location" };

            await userController.updateUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));
        });
    });

    describe("getAppStats", () => {
        it("should return a 200 status code with user and job counts", async () => {
            (mockUserRepository.count as Mock).mockResolvedValue(10);
            (mockJobRepository.count as Mock).mockResolvedValue(20);

            await userController.getAppStats(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ users: 10, jobs: 20 });
        });
    });

    describe("Unauthenticated access", () => {
        beforeEach(() => {
            req.user = undefined;
        });

        it("getCurrentUser should throw UnauthorizedError", async () => {
            await expect(userController.getCurrentUser(req as Request, res as Response)).rejects.toThrow(
                "Invalid credentials"
            );
        });

        it("updateUser should throw UnauthorizedError", async () => {
            await expect(userController.updateUser(req as Request, res as Response)).rejects.toThrow(
                "Invalid credentials"
            );
        });
    });

    describe("getCurrentUser error paths", () => {
        it("should throw an error if the user is not found", async () => {
            (mockUserRepository.getById as Mock).mockResolvedValue(null);
            await expect(userController.getCurrentUser(req as Request, res as Response)).rejects.toThrow(
                "Invalid credentials"
            );
        });
    });

    describe("updateUser with file", () => {
        it("should handle file upload", async () => {
            const user = new User({
                id: new EntityId(VALID_MONGO_ID),
                name: "Test",
                lastName: "User",
                email: Email.create("test@example.com"),
                password: UserPassword.createFromHashed("hashedPassword"),
                role: UserRole.USER,
                location: "Test Location",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            (mockUserRepository.getById as Mock).mockResolvedValue(user);
            req.body = { name: "Updated Name", lastName: "Last Name", location: "Updated Location" };
            req.file = { buffer: Buffer.from("some image") } as any;

            await userController.updateUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));
        });
    });
});
