import { describe, it, expect, vi } from "vitest";
import TokenManager from "../../../dist/infrastructure/security/TokenManager.js";
import jwt from "jsonwebtoken";

vi.mock("jsonwebtoken");

describe("TokenManager", () => {
    const tokenManager = new TokenManager();
    const payload = { userId: "123", role: "user" };

    it("should generate a token", () => {
        const mockToken = "mockToken";
        vi.spyOn(jwt, "sign").mockReturnValue(mockToken);
        const token = tokenManager.generateToken(payload);
        expect(token).toBe(mockToken);
        expect(token).toBeTypeOf("string");
    });

    it("should verify a token", () => {
        const mockDecoded = { userId: "123", role: "user" };
        vi.spyOn(jwt, "verify").mockReturnValue(mockDecoded);
        const token = tokenManager.generateToken(payload);
        const decoded = tokenManager.verifyToken(token);
        expect(decoded).toEqual(mockDecoded);
    });

    it("should throw an error for an invalid token", () => {
        const invalidToken = "invalidtoken";
        vi.spyOn(jwt, "verify").mockImplementation(() => {
            throw new Error("Invalid token");
        });
        expect(() => tokenManager.verifyToken(invalidToken)).toThrow("Invalid token");
    });

    it("should throw an error for an expired token", () => {
        const token = tokenManager.generateToken(payload);
        vi.spyOn(jwt, "verify").mockImplementation(() => {
            throw new jwt.TokenExpiredError("Token expired", new Date());
        });
        expect(() => tokenManager.verifyToken(token)).toThrow(jwt.TokenExpiredError);
    });

    it("should use environment variables for token generation", () => {
        const secret = "test_secret";
        const expiresIn = "1h";
        process.env.JWT_SECRET = secret;
        process.env.JWT_EXPIRES_IN = expiresIn;

        const signSpy = vi.spyOn(jwt, "sign");
        tokenManager.generateToken(payload);

        expect(signSpy).toHaveBeenCalledWith(payload, secret, { expiresIn });

        delete process.env.JWT_SECRET;
        delete process.env.JWT_EXPIRES_IN;
    });

    it("should use environment variables for token verification", () => {
        const secret = "test_secret";
        process.env.JWT_SECRET = secret;

        const verifySpy = vi.spyOn(jwt, "verify");
        const token = "some_token";
        try {
            tokenManager.verifyToken(token);
        } catch (error) {
            // We expect this to fail, but we just want to check the spy
        }


        expect(verifySpy).toHaveBeenCalledWith(token, secret);

        delete process.env.JWT_SECRET;
    });
});
