import { loadEnv } from "@dns-markdown/env";
import { defineConfig, devices } from "@playwright/test";

/**
 * E2E runs on the root `.env.test` (+ `.env`), loaded by `loadEnv` from @dns-markdown/env.
 * Without this the runner gets no env files at all (`clerkSetup` only looks for `.env.local`/`.env`
 * in apps/web) and `next start` falls back to `.env.production`. The workers and the web server
 * inherit both NODE_ENV and the loaded vars. On CI there are no env files: vars come from the workflow.
 * `.mts` on purpose: Playwright compiles a `.ts` config to CommonJS, which breaks `import.meta`
 * in @dns-markdown/env.
 */
if (!process.env.NODE_ENV) Object.assign(process.env, { NODE_ENV: "test" });
loadEnv();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./playwright",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. Locally run the full suite with --workers=1 too: all
   * signed-in tests log in the same Clerk test user and the favorites specs mutate its state,
   * so parallel workers make them time out. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry"
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup deps",
      testMatch: /global\.setup\.ts/
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup deps"]
    }
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI
  }
});
