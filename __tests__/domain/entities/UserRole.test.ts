import { describe, it, expect } from 'vitest';
import UserRole from '../../../src/domain/entities/UserRole.js';

describe('UserRole', () => {
  it('should have the correct values for USER and ADMIN', () => {
    expect(UserRole.USER).toBe('user');
    expect(UserRole.ADMIN).toBe('admin');
  });
});