import { clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";

import { remove } from "@/cache";

// Setup must be run serially, this is necessary if Playwright is configured to run fully parallel: https://playwright.dev/docs/test-parallel
setup.describe.configure({ mode: "serial" });

setup("global setup", async ({}) => {
  await remove(process.env.E2E_CLERK_USER_ID!);

  await clerkSetup();
});
