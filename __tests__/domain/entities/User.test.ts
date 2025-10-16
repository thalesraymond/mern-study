import { describe, it, expect } from 'vitest';
import User from '../../../src/domain/entities/User.js';
import Email from '../../../src/domain/entities/Email.js';
import UserPassword from '../../../src/domain/entities/UserPassword.js';
import UserRole from '../../../src/domain/entities/UserRole.js';
import { EntityId } from '../../../src/domain/entities/EntityId.js';

describe('User', () => {
  const userData = {
    name: 'Test User',
    email: Email.create('test@example.com'),
    password: UserPassword.createFromHashed('hashedPassword'),
    role: UserRole.USER,
    lastName: 'Last Name',
    location: 'Location',
    id: new EntityId('60d5ec49e0d3f4a3c8d3e8b1'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create a valid User', () => {
    const user = new User(userData);
    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe(userData.name);
  });

  it('should throw an error if name is missing', () => {
    const data = { ...userData, name: '' };
    expect(() => new User(data)).toThrow('name is required');
  });

  it('should throw an error if last name is missing', () => {
    const data = { ...userData, lastName: '' };
    expect(() => new User(data)).toThrow('last name is required');
  });

  it('should throw an error if location is missing', () => {
    const data = { ...userData, location: '' };
    expect(() => new User(data)).toThrow('location is required');
  });

  it('should throw an error if email is missing', () => {
    const data = { ...userData, email: undefined as any };
    expect(() => new User(data)).toThrow('email is required');
  });

  it('should throw an error if role is missing', () => {
    const data = { ...userData, role: undefined as any };
    expect(() => new User(data)).toThrow('role is required');
  });
});