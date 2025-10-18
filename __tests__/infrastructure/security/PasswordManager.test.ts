import { describe, it, expect } from "vitest";
import PasswordManager from "../../../src/infrastructure/security/PasswordManager.js";

describe("PasswordManager", () => {
    const passwordManager = new PasswordManager();

    it("should hash a password", () => {
        const password = "password123";
        const hashedPassword = passwordManager.hash(password);
        expect(hashedPassword).not.toBe(password);
    });

    it("should return a different hash for the same password", () => {
        const password = "password123";
        const hashedPassword1 = passwordManager.hash(password);
        const hashedPassword2 = passwordManager.hash(password);
        expect(hashedPassword1).not.toBe(hashedPassword2);
    });

    it("should compare a password with a hash", async () => {
        const password = "password123";
        const hashedPassword = passwordManager.hash(password);
        const result = await passwordManager.compare(password, hashedPassword);
        expect(result).toBe(true);
    });

    it("should return false when comparing a wrong password with a hash", async () => {
        const password = "password123";
        const wrongPassword = "wrongpassword";
        const hashedPassword = passwordManager.hash(password);
        const result = await passwordManager.compare(wrongPassword, hashedPassword);
        expect(result).toBe(false);
    });
});
