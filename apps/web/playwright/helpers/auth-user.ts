import { resolve } from "node:path";

import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";

import type { BrowserContext, Page } from "@playwright/test";

const authFile = resolve("playwright/.clerk/user.json");

// Test user credentials come from apps/web/.env.local locally (see .env.local.example) and from
// the workflow secrets on CI
const getCredentials = () => {
  const { E2E_CLERK_USER_USERNAME: identifier, E2E_CLERK_USER_PASSWORD: password } = process.env;
  if (!identifier || !password) {
    throw new Error("E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD must be set");
  }
  return { identifier, password };
};

export const authUser = async (page: Page, context: BrowserContext) => {
  await setupClerkTestingToken({ context, page });

  // Navigate to the app to establish the session
  await page.goto("/");

  await clerk.signIn({
    page,
    signInParams: { strategy: "password", ...getCredentials() }
  });

  await page.context().storageState({ path: authFile });
};
