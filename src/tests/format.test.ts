import { describe, it, expect } from 'vitest';
import { capitalize } from '../utils/format';

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should return an empty string if the input is empty', () => {
    expect(capitalize('')).toBe('');
  });

  it('should not change a string that is already capitalized', () => {
    expect(capitalize('World')).toBe('World');
  });
});
