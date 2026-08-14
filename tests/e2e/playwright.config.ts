import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.QA_BASE_URL ?? 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run api',
      url: 'http://localhost:3000/api/v1/health',
      reuseExistingServer: true,
      timeout: 30000
    },
    {
      command: 'npm run web',
      url: 'http://localhost:4200',
      reuseExistingServer: true,
      timeout: 60000
    }
  ]
});
