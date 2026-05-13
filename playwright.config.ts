import { defineConfig, devices } from '@playwright/test';

const frontendPort = Number(process.env.E2E_FRONTEND_PORT ?? 4201);

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${frontendPort}`,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npm run start:local -- --port ${frontendPort}`,
    url: `http://localhost:${frontendPort}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
