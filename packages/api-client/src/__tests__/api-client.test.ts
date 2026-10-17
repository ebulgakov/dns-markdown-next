import { beforeEach, describe, expect, mock, test } from "bun:test";

import { createApiClient } from "../index";

import type { Goods } from "@dns-markdown/types/pricelist";
import type { User } from "@dns-markdown/types/user";

type Call = (url: string, ...args: unknown[]) => Promise<{ data: unknown }>;

const get = mock<Call>(async () => ({ data: { ok: true } }));
const post = mock<Call>(async () => ({ data: { ok: true } }));
const onError = mock<(endpoint: string, error: unknown) => void>(() => {});
const api = createApiClient({ http: { get, post }, onError });

const product = { _id: "g1", link: "/p/1" } as Goods;
const users = [{ userId: "u1" }] as User[];
const auth = { headers: { Authorization: "Bearer tok" } };

beforeEach(() => {
  for (const fn of [get, post, onError]) fn.mockClear();
});

describe("GET endpoints", () => {
  test.each([
    [
      "pricelist.getLast",
      () => api.pricelist.getLast("samara"),
      "/api/pricelist",
      { city: "samara" }
    ],
    [
      "pricelist.getDates",
      () => api.pricelist.getDates("samara"),
      "/api/pricelist/list",
      { city: "samara" }
    ],
    [
      "products.getByLink",
      () => api.products.getByLink("/p/1"),
      "/api/products/link",
      { link: "/p/1" }
    ],
    [
      "products.getMostCheap",
      () => api.products.getMostCheap("samara"),
      "/api/products/most-cheap-products",
      { city: "samara" }
    ],
    [
      "products.getMostDiscounted",
      () => api.products.getMostDiscounted("samara"),
      "/api/products/most-discounted-products",
      { city: "samara" }
    ],
    [
      "products.getMostProfitable",
      () => api.products.getMostProfitable("samara"),
      "/api/products/most-profitable-products",
      { city: "samara" }
    ],
    [
      "analysis.getLastDiff",
      () => api.analysis.getLastDiff("samara"),
      "/api/analysis/last-diff",
      { city: "samara" }
    ],
    [
      "analysis.getAllDiffs",
      () => api.analysis.getAllDiffs("samara"),
      "/api/analysis/all-diffs",
      { city: "samara" }
    ],
    [
      "analysis.getProductsCount",
      () => api.analysis.getProductsCount("samara"),
      "/api/analysis/products-count",
      { city: "samara" }
    ],
    [
      "analysis.getReports",
      () => api.analysis.getReports("samara"),
      "/api/analysis/reports",
      { city: "samara" }
    ],
    [
      "analysis.getTotalUniqProductsCount",
      () => api.analysis.getTotalUniqProductsCount("samara"),
      "/api/analysis/total-uniq-products-count",
      { city: "samara" }
    ],
    [
      "analysis.getGoodsByDateAdded",
      () => api.analysis.getGoodsByDateAdded({ city: "samara", date: "2026-10-16" }),
      "/api/analysis/all-analysis-goods-by-date-added",
      { city: "samara", dateAdded: "2026-10-16" }
    ],
    [
      "llm.compareProducts",
      () => api.llm.compareProducts(["/a", "/b"]),
      "/api/llm/compare-products",
      { links: '["/a","/b"]' }
    ],
    [
      "llm.describeProduct",
      () => api.llm.describeProduct("/a"),
      "/api/llm/describe-product",
      { link: "/a" }
    ],
    [
      "service.getAllPriceLists",
      () => api.service.getAllPriceLists({ city: "samara", limit: 2 }),
      "/service/all-price-lists",
      { city: "samara", limit: 2 }
    ],
    [
      "service.getAllNotificationUsers",
      () => api.service.getAllNotificationUsers("samara"),
      "/service/all-notification-users",
      { city: "samara" }
    ]
  ])("%s calls the right endpoint and returns response data", async (_, call, url, params) => {
    expect<unknown>(await call()).toEqual({ ok: true });
    expect(get).toHaveBeenCalledWith(url, { params });
    expect(post).not.toHaveBeenCalled();
  });

  test("pricelist.getById puts the id into the path", async () => {
    await api.pricelist.getById("abc");
    expect(get).toHaveBeenCalledWith("/api/pricelist/id/abc", {});
  });
});

describe("service POST endpoints", () => {
  test.each([
    [
      "savePriceList",
      () => api.service.savePriceList("samara", []),
      "/service/add-new-price-list",
      { city: "samara", positions: [] }
    ],
    [
      "deleteLastPriceList",
      () => api.service.deleteLastPriceList("samara"),
      "/service/delete-last-price-list",
      { city: "samara" }
    ],
    [
      "deleteOldPriceLists",
      () => api.service.deleteOldPriceLists("samara"),
      "/service/delete-old-price-lists",
      { city: "samara" }
    ],
    [
      "addNewReportByCity",
      () => api.service.addNewReportByCity({ city: "samara" }),
      "/service/add-analysis-report",
      { city: "samara" }
    ],
    [
      "deleteReportByCityDate",
      () => api.service.deleteReportByCityDate({ city: "samara", dateAdded: "d" }),
      "/service/delete-analysis-report-by-city-date",
      { city: "samara", dateAdded: "d" }
    ],
    [
      "addManyAnalysisData",
      () => api.service.addManyAnalysisData({ analysisData: [] }),
      "/service/insert-analysis-data",
      { analysisData: [] }
    ],
    [
      "deleteAllAnalysisData",
      () => api.service.deleteAllAnalysisData("samara"),
      "/service/delete-analysis-data",
      { city: "samara" }
    ],
    [
      "deleteAnalysisByDateData",
      () => api.service.deleteAnalysisByDateData({ city: "samara", date: "d" }),
      "/service/delete-analysis-data-by-date",
      { city: "samara", dateAdded: "d" }
    ],
    [
      "addManyAnalysisDiff",
      () => api.service.addManyAnalysisDiff([]),
      "/service/insert-analysis-diff",
      { diff: [] }
    ],
    [
      "deleteAnalysisDiffAll",
      () => api.service.deleteAnalysisDiffAll("samara"),
      "/service/delete-analysis-diff",
      { city: "samara" }
    ],
    [
      "deleteAnalysisDiffByDate",
      () => api.service.deleteAnalysisDiffByDate({ city: "samara", date: "d" }),
      "/service/delete-analysis-diff-by-date",
      { city: "samara", dateAdded: "d" }
    ],
    [
      "updateUsersFavorites",
      () => api.service.updateUsersFavorites(users),
      "/service/update-users-favorites",
      { users }
    ],
    [
      "clearCacheByKeys",
      () => api.service.clearCacheByKeys("daily:*"),
      "/service/clear-cache-by-key",
      { keys: "daily:*" }
    ]
  ])("%s posts the right body without extra config", async (_, call, url, body) => {
    expect<unknown>(await call()).toEqual({ ok: true });
    expect(post).toHaveBeenCalledWith(url, body);
    expect(post.mock.calls[0]).toHaveLength(2);
  });
});

describe("user endpoints", () => {
  test.each([
    ["get", () => api.user.get("tok"), "/api/user", {}],
    [
      "updateNotifications",
      () => api.user.updateNotifications("tok", { updates: { enabled: true } }),
      "/api/user/notifications-update",
      { notifications: { updates: { enabled: true } } }
    ],
    [
      "toggleShownBoughtFavorites",
      () => api.user.toggleShownBoughtFavorites("tok", false),
      "/api/user/toggle-shown-bought-favorites",
      { status: false }
    ],
    [
      "changeCity",
      () => api.user.changeCity("tok", "moscow"),
      "/api/user/change-city",
      { city: "moscow" }
    ],
    [
      "addFavorite",
      () => api.user.addFavorite("tok", product, "samara"),
      "/api/user/favorite-add",
      { product: { ...product, city: "samara" } }
    ],
    [
      "removeFavorite",
      () => api.user.removeFavorite("tok", "/p/1"),
      "/api/user/favorite-remove",
      { link: "/p/1" }
    ],
    [
      "addHiddenSection",
      () => api.user.addHiddenSection("tok", "T"),
      "/api/user/hidden-section-add",
      { title: "T" }
    ],
    [
      "removeHiddenSection",
      () => api.user.removeHiddenSection("tok", "T"),
      "/api/user/hidden-section-remove",
      { title: "T" }
    ],
    [
      "addFavoriteSection",
      () => api.user.addFavoriteSection("tok", "T"),
      "/api/user/favorite-section-add",
      { title: "T" }
    ],
    [
      "removeFavoriteSection",
      () => api.user.removeFavoriteSection("tok", "T"),
      "/api/user/favorite-section-remove",
      { title: "T" }
    ]
  ])("%s posts with the session token", async (_, call, url, body) => {
    expect<unknown>(await call()).toEqual({ ok: true });
    expect(post).toHaveBeenCalledWith(url, body, auth);
    expect(get).not.toHaveBeenCalled();
  });
});

describe("errors", () => {
  test("calls onError with the endpoint and rethrows", async () => {
    const failure = new Error("Network down");
    get.mockImplementationOnce(async () => {
      throw failure;
    });

    await expect(api.pricelist.getLast("samara")).rejects.toThrow("Network down");
    expect(onError).toHaveBeenCalledWith("/api/pricelist", failure);
  });

  test("works without onError", async () => {
    const bare = createApiClient({ http: { get, post } });
    post.mockImplementationOnce(async () => {
      throw new Error("boom");
    });

    await expect(bare.service.clearCacheByKeys("k")).rejects.toThrow("boom");
  });
});

describe("createHttpClient config", () => {
  test("sets secret and service key headers only when given", () => {
    const withKeys = createApiClient({
      baseURL: "http://api",
      apiSecret: "s",
      serviceKey: "k",
      timeout: 5
    });
    const plain = createApiClient({ baseURL: "http://api" });
    const headersOf = (client: typeof withKeys) =>
      (
        client.http as unknown as {
          defaults: { headers: Record<string, unknown>; timeout: number };
        }
      ).defaults;

    expect(headersOf(withKeys).headers["X-Internal-API-Secret"]).toBe("s");
    expect(headersOf(withKeys).headers.Authorization).toBe("Bearer k");
    expect(headersOf(withKeys).timeout).toBe(5);
    expect(headersOf(plain).headers["X-Internal-API-Secret"]).toBeUndefined();
    expect(headersOf(plain).headers.Authorization).toBeUndefined();
  });
});
