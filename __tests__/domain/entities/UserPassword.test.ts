import { describe, it, expect, vi } from 'vitest';
import UserPassword from '../../../src/domain/entities/UserPassword.js';
import BadRequestError from '../../../src/errors/BadRequestError.js';

describe('UserPassword', () => {
  it('should create a UserPassword from a hashed password', () => {
    const hashedPassword = 'hashedPassword';
    const userPassword = UserPassword.createFromHashed(hashedPassword);
    expect(userPassword).toBeInstanceOf(UserPassword);
    expect(userPassword.hashedPassword).toBe(hashedPassword);
  });

  it('should create a UserPassword from a raw password and hash it', async () => {
    const rawPassword = 'password123';
    const hashFunction = vi.fn().mockResolvedValue('hashedPassword');
    const userPassword = await UserPassword.create(rawPassword, hashFunction);
    expect(userPassword).toBeInstanceOf(UserPassword);
    expect(userPassword.rawPassword).toBe(rawPassword);
    expect(userPassword.hashedPassword).toBe('hashedPassword');
    expect(hashFunction).toHaveBeenCalledWith(rawPassword);
  });

  it('should throw an error if both raw and hashed passwords are not provided', () => {
    // This is not directly testable as the constructor is private.
    // We can test the validation through the public factory methods.
    // Let's test the validation logic by calling the constructor directly for the sake of the example,
    // assuming we can bypass the private constraint for testing purposes.
    // In a real scenario, we would refactor to make it testable.
    expect(() => UserPassword.createFromHashed('')).toThrow(BadRequestError)
  });

  it('should throw an error if the raw password is less than 6 characters long', async () => {
    const rawPassword = '12345';
    const hashFunction = vi.fn().mockResolvedValue('hashedPassword');
    await expect(UserPassword.create(rawPassword, hashFunction)).rejects.toThrow(
      new BadRequestError('password must be at least 6 characters long'),
    );
  });
});