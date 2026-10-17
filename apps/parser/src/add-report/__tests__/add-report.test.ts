import { apiPost, env, resetMocks } from "@src/__tests__/setup";
import { beforeEach, describe, expect, test } from "bun:test";

import { addReport } from "../add-report";

describe("addReport", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("throws without CITY", async () => {
    env.CITY = undefined;

    await expect(addReport()).rejects.toThrow("No city found");
    expect(apiPost).not.toHaveBeenCalled();
  });

  test("asks the API to generate a report for the city", async () => {
    env.CITY = "moscow";

    await addReport();

    expect(apiPost).toHaveBeenCalledWith("/service/add-analysis-report", { city: "moscow" });
  });
});
