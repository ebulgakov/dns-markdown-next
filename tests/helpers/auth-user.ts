import { resolve } from "node:path";

import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";

import type { Page } from "@playwright/test";

const authFile = resolve("playwright/.clerk/user.json");

export const authUser = async (page: Page) => {
  await setupClerkTestingToken({ page });

  // Navigate to the app to establish the session
  await page.goto("/");

  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!
    }
  });

  await page.context().storageState({ path: authFile });
};
