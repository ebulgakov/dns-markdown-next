import { apiPost, env, resetMocks, webPost } from "@src/__tests__/setup";
import { beforeEach, describe, expect, test } from "bun:test";

import { clearCache } from "../cache-clear";

describe("clearCache", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("clears API cache keys from KEYS and revalidates the web daily-data tag", async () => {
    env.KEYS = "local:*";

    await clearCache();

    expect(apiPost).toHaveBeenCalledWith("/service/clear-cache-by-key", { keys: "local:*" });
    expect(webPost).toHaveBeenCalledWith("/api/revalidate", { tag: "daily-data" });
  });

  test("does not need CITY", async () => {
    env.CITY = undefined;

    await expect(clearCache()).resolves.toBeUndefined();
  });
});
