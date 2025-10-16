import { describe, it, expect } from 'vitest';
import { EntityId } from '../../../src/domain/entities/EntityId.js';

describe('EntityId', () => {
  it('should create a valid EntityId', () => {
    const validId = '60d5ec49e0d3f4a3c8d3e8b1';
    const entityId = new EntityId(validId);
    expect(entityId).toBeInstanceOf(EntityId);
    expect(entityId.toString()).toBe(validId);
  });

  it('should throw an error for an invalid EntityId', () => {
    const invalidId = 'invalid-id';
    expect(() => new EntityId(invalidId)).toThrow('Invalid Entity ID format');
  });

  it('should throw an error for an empty EntityId', () => {
    const emptyId = '';
    expect(() => new EntityId(emptyId)).toThrow('Invalid Entity ID format');
  });

  it('should be case-insensitive for valid hex characters', () => {
    const mixedCaseId = '60D5EC49E0D3F4A3C8D3E8B1';
    const entityId = new EntityId(mixedCaseId);
    expect(entityId.toString()).toBe(mixedCaseId);
  });
});