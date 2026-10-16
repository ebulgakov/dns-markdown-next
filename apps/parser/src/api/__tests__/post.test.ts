import { apiPost, resetMocks, webPost } from "@src/__tests__/mocks";
import { beforeEach, describe, expect, spyOn, test } from "bun:test";

import {
  addManyAnalysisData,
  addManyAnalysisDiff,
  addNewReportByCity,
  clearCacheByKeys,
  clearWebCache,
  deleteAllAnalysisData,
  deleteAnalysisByDateData,
  deleteAnalysisDiffAll,
  deleteAnalysisDiffByDate,
  deleteLastPriceList,
  deleteOldPriceLists,
  deleteReportByCityDate,
  savePriceList,
  updateUsersFavorites
} from "../post";

describe("api/post", () => {
  beforeEach(() => {
    resetMocks();
    apiPost.mockImplementation(async () => ({ data: { ok: true } }));
  });

  test.each([
    [
      "deleteLastPriceList",
      () => deleteLastPriceList("samara"),
      "/service/delete-last-price-list",
      { city: "samara" }
    ],
    [
      "savePriceList",
      () => savePriceList("samara", []),
      "/service/add-new-price-list",
      { city: "samara", positions: [] }
    ],
    [
      "deleteReportByCityDate",
      () => deleteReportByCityDate({ city: "samara", dateAdded: "2026-10-16" }),
      "/service/delete-analysis-report-by-city-date",
      { city: "samara", dateAdded: "2026-10-16" }
    ],
    [
      "addNewReportByCity",
      () => addNewReportByCity({ city: "samara" }),
      "/service/add-analysis-report",
      { city: "samara" }
    ],
    [
      "deleteAllAnalysisData",
      () => deleteAllAnalysisData("samara"),
      "/service/delete-analysis-data",
      { city: "samara" }
    ],
    [
      "deleteAnalysisByDateData",
      () => deleteAnalysisByDateData({ city: "samara", date: "2026-10-16" }),
      "/service/delete-analysis-data-by-date",
      { city: "samara", dateAdded: "2026-10-16" }
    ],
    [
      "addManyAnalysisData",
      () => addManyAnalysisData({ analysisData: [] }),
      "/service/insert-analysis-data",
      { analysisData: [] }
    ],
    [
      "addManyAnalysisDiff",
      () => addManyAnalysisDiff([]),
      "/service/insert-analysis-diff",
      { diff: [] }
    ],
    [
      "updateUsersFavorites",
      () => updateUsersFavorites([]),
      "/service/update-users-favorites",
      { users: [] }
    ],
    [
      "deleteAnalysisDiffAll",
      () => deleteAnalysisDiffAll("samara"),
      "/service/delete-analysis-diff",
      { city: "samara" }
    ],
    [
      "deleteAnalysisDiffByDate",
      () => deleteAnalysisDiffByDate({ city: "samara", date: "2026-10-16" }),
      "/service/delete-analysis-diff-by-date",
      { city: "samara", dateAdded: "2026-10-16" }
    ],
    [
      "deleteOldPriceLists",
      () => deleteOldPriceLists("samara"),
      "/service/delete-old-price-lists",
      { city: "samara" }
    ],
    [
      "clearCacheByKeys",
      () => clearCacheByKeys("daily:*"),
      "/service/clear-cache-by-key",
      { keys: "daily:*" }
    ]
  ])("%s posts to the right endpoint and returns response data", async (_, call, url, body) => {
    await expect((call as () => Promise<unknown>)()).resolves.toEqual({ ok: true });
    expect(apiPost).toHaveBeenCalledWith(url, body);
  });

  test("clearWebCache posts the tag to the web app revalidate endpoint", async () => {
    await clearWebCache("daily-data");

    expect(webPost).toHaveBeenCalledWith("/api/revalidate", { tag: "daily-data" });
    expect(apiPost).not.toHaveBeenCalled();
  });

  test("logs and rethrows client errors", async () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    apiPost.mockImplementation(async () => {
      throw new Error("Network down");
    });

    await expect(deleteOldPriceLists("samara")).rejects.toThrow("Network down");
    expect(error).toHaveBeenCalledWith(
      "Error fetching data from /service/delete-old-price-lists:",
      expect.any(Error)
    );
    error.mockRestore();
  });
});
