
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['client/**', 'node_modules/**'],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      }
    },
  },
});
