import { describe, it, expect } from "vitest";
import Email from "../../../src/domain/entities/Email.js";

describe("Email", () => {
    it("should create a valid email", () => {
        const email = Email.create("test@example.com");
        expect(email).toBeInstanceOf(Email);
        expect(email.getValue()).toBe("test@example.com");
    });

    it("should throw an error for an invalid email", () => {
        expect(() => Email.create("invalid-email")).toThrow("Invalid email address");
    });

    it("should throw an error for a very long email", () => {
        expect(() => Email.create("a".repeat(1000) + "@example.com")).toThrow("Invalid email address");
    });

    it("should throw an error for an empty email", () => {
        expect(() => Email.create("")).toThrow("Invalid email address");
    });
});
