import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/server.ts', 'src/**/*.spec.ts', '**/*.config.ts'],
      thresholds: {
        lines: 80,
        branches: 80
      }
    }
  }
});
