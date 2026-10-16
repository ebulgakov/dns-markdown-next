import {
  apiGet,
  env,
  makeGoods,
  makePriceList,
  mockGetResponses,
  postBody,
  postedEndpoints,
  resetMocks
} from "@src/__tests__/mocks";
import { beforeEach, describe, expect, test } from "bun:test";

import { addAnalysisData } from "../add-analysis-data";

import type { AnalysisData } from "@dns-markdown/db/types/analysis-data";

const latest = makePriceList({
  createdAt: "2026-10-16T10:00:00.000Z",
  positions: [{ _id: "p1", title: "Смартфоны", items: [makeGoods({ link: "/latest/" })] }]
});
const previous = makePriceList({
  createdAt: "2026-10-15T10:00:00.000Z",
  positions: [{ _id: "p2", title: "Смартфоны", items: [makeGoods({ link: "/previous/" })] }]
});

const insertedLinks = () =>
  (postBody("/service/insert-analysis-data") as { analysisData: AnalysisData[] }).analysisData.map(
    item => item.link
  );

describe("addAnalysisData", () => {
  beforeEach(() => {
    resetMocks();
    mockGetResponses({ "/service/all-price-lists": [latest, previous] });
  });

  test("throws without CITY", async () => {
    env.CITY = undefined;

    await expect(addAnalysisData()).rejects.toThrow("No city found");
    expect(apiGet).not.toHaveBeenCalled();
  });

  test("insert: reindexes only the latest price list", async () => {
    env.WRITE_STRATEGY = "insert";

    await addAnalysisData();

    expect(apiGet).toHaveBeenCalledWith("/service/all-price-lists", {
      params: { city: "samara", limit: 2 }
    });
    expect(postedEndpoints()).toEqual([
      "/service/delete-analysis-data-by-date",
      "/service/insert-analysis-data"
    ]);
    expect(postBody("/service/delete-analysis-data-by-date")).toEqual({
      city: "samara",
      dateAdded: latest.createdAt
    });
    expect(insertedLinks()).toEqual(["/latest/"]);
  });

  test("replace: deletes all analysis data of the city and inserts every price list", async () => {
    env.WRITE_STRATEGY = "replace";

    await addAnalysisData();

    expect(apiGet).toHaveBeenCalledWith("/service/all-price-lists", {
      params: { city: "samara", limit: undefined }
    });
    expect(postedEndpoints()).toEqual([
      "/service/delete-analysis-data",
      "/service/insert-analysis-data"
    ]);
    expect(postBody("/service/delete-analysis-data")).toEqual({ city: "samara" });
    expect(insertedLinks()).toEqual(["/latest/", "/previous/"]);
  });

  test("insert with no price lists deletes nothing and inserts an empty collection", async () => {
    mockGetResponses({ "/service/all-price-lists": [] });

    await addAnalysisData();

    expect(postedEndpoints()).toEqual(["/service/insert-analysis-data"]);
    expect(insertedLinks()).toEqual([]);
  });
});
