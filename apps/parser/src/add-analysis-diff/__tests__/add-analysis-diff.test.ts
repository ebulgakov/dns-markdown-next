import { makeAnalysisData, makePriceList } from "@dns-markdown/tests/fixtures";
import { apiGet, env, postBody, postedEndpoints, resetMocks } from "@src/__tests__/setup";
import { beforeEach, describe, expect, test } from "bun:test";

import { addAnalysisDiff } from "../add-analysis-diff";

import type { AnalysisDiff } from "@dns-markdown/types/analysis-diff";

const day1 = makePriceList({ createdAt: "2026-10-14T10:00:00.000Z" });
const day2 = makePriceList({ createdAt: "2026-10-15T10:00:00.000Z" });
const day3 = makePriceList({ createdAt: "2026-10-16T10:00:00.000Z" });

// Analysis goods per price-list date
const goodsByDate: Record<string, ReturnType<typeof makeAnalysisData>[]> = {
  [day1.createdAt]: [makeAnalysisData({ link: "/a/", price: "900" })],
  [day2.createdAt]: [
    makeAnalysisData({ link: "/a/", price: "800" }),
    makeAnalysisData({ link: "/b/" })
  ],
  [day3.createdAt]: [makeAnalysisData({ link: "/b/" })]
};

const mockApi = (priceLists: ReturnType<typeof makePriceList>[]) => {
  apiGet.mockImplementation(async (endpoint: string, options?: unknown) => {
    if (endpoint === "/service/all-price-lists") return { data: priceLists };
    if (endpoint === "/api/analysis/all-analysis-goods-by-date-added") {
      const { params } = options as { params: { dateAdded: string } };
      return { data: goodsByDate[params.dateAdded] ?? [] };
    }
    throw new Error(`Unexpected GET ${endpoint}`);
  });
};

const insertedDiffs = () =>
  (postBody("/service/insert-analysis-diff") as { diff: AnalysisDiff[] }).diff;

describe("addAnalysisDiff", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("throws without CITY", async () => {
    env.CITY = undefined;

    await expect(addAnalysisDiff()).rejects.toThrow("No city found");
    expect(apiGet).not.toHaveBeenCalled();
  });

  test("insert: replaces the diff of the latest day only", async () => {
    env.WRITE_STRATEGY = "insert";
    mockApi([day3, day2]);

    await addAnalysisDiff();

    expect(apiGet).toHaveBeenCalledWith("/service/all-price-lists", {
      params: { city: "samara", limit: 2 }
    });
    expect(postedEndpoints()).toEqual([
      "/service/delete-analysis-diff-by-date",
      "/service/insert-analysis-diff"
    ]);
    expect(postBody("/service/delete-analysis-diff-by-date")).toEqual({
      city: "samara",
      dateAdded: day3.createdAt
    });

    const diffs = insertedDiffs();
    expect(diffs).toHaveLength(1);
    expect(diffs[0]?.dateAdded).toBe(day3.createdAt);
    expect(diffs[0]?.removedItems.map(item => item.link)).toEqual(["/a/"]);
    expect(diffs[0]?.newItems).toEqual([]);
  });

  test("replace: rebuilds diffs for every pair plus the oldest list against an empty state", async () => {
    env.WRITE_STRATEGY = "replace";
    mockApi([day3, day2, day1]);

    await addAnalysisDiff();

    expect(postedEndpoints()).toEqual([
      "/service/delete-analysis-diff",
      "/service/insert-analysis-diff"
    ]);
    expect(postBody("/service/delete-analysis-diff")).toEqual({ city: "samara" });

    const diffs = insertedDiffs();
    expect(diffs.map(diff => diff.dateAdded)).toEqual([
      day3.createdAt,
      day2.createdAt,
      day1.createdAt
    ]);
    // day2 vs day1: /a/ got cheaper, /b/ is new
    expect(diffs[1]?.changesPrice.map(change => change.item.link)).toEqual(["/a/"]);
    expect(diffs[1]?.newItems.map(item => item.link)).toEqual(["/b/"]);
    // day1 vs empty: everything is new
    expect(diffs[2]?.newItems.map(item => item.link)).toEqual(["/a/"]);
  });

  test("insert with a single price list deletes its diff and inserts nothing new", async () => {
    mockApi([day3]);

    await addAnalysisDiff();

    expect(insertedDiffs()).toEqual([]);
  });
});
