import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';
import { setEnvironment } from './src/lib/testEnvHandler';
config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Test timeout. By Default a single test run has a default time out of 30 seconds. If the test hasn't finished with in
  // that time it will be marked as a failure. We can change the default test timeout below
  timeout: 30000,
  expect: { timeout: 10 * 5000 },
  testDir: './src/tests',
  /* Run ALL tests in ALL files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 6 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-first-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 30000,
    actionTimeout: 30000,
    headless: true,
    baseURL: setEnvironment(),
    launchOptions: {
      slowMo: 1_000,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 1080 } },
    },
  ],
});
