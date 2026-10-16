import { apiGet, resetMocks } from "@src/__tests__/mocks";
import { beforeEach, describe, expect, spyOn, test } from "bun:test";

import {
  getAllNotificationUsers,
  getAllPriceLists,
  getAnalysisGoodsByDateAdded,
  getLastPriceList
} from "../get";

describe("api/get", () => {
  beforeEach(() => {
    resetMocks();
    apiGet.mockImplementation(async () => ({ data: { ok: true } }));
  });

  test.each([
    ["getLastPriceList", () => getLastPriceList("samara"), "/api/pricelist", { city: "samara" }],
    [
      "getAllPriceLists",
      () => getAllPriceLists({ city: "samara", limit: 2 }),
      "/service/all-price-lists",
      { city: "samara", limit: 2 }
    ],
    [
      "getAllNotificationUsers",
      () => getAllNotificationUsers("samara"),
      "/service/all-notification-users",
      { city: "samara" }
    ],
    [
      "getAnalysisGoodsByDateAdded",
      () => getAnalysisGoodsByDateAdded({ city: "samara", date: "2026-10-16" }),
      "/api/analysis/all-analysis-goods-by-date-added",
      { city: "samara", dateAdded: "2026-10-16" }
    ]
  ])("%s calls the right endpoint and returns response data", async (_, call, url, params) => {
    await expect((call as () => Promise<unknown>)()).resolves.toEqual({ ok: true });
    expect(apiGet).toHaveBeenCalledWith(url, { params });
  });

  test("logs and rethrows client errors", async () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    apiGet.mockImplementation(async () => {
      throw new Error("Network down");
    });

    await expect(getLastPriceList("samara")).rejects.toThrow("Network down");
    expect(error).toHaveBeenCalledWith(
      "Error fetching data from /api/pricelist:",
      expect.any(Error)
    );
    error.mockRestore();
  });
});
