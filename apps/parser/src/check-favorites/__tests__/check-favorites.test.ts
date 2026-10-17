import {
  apiGet,
  apiPost,
  env,
  makeAnalysisData,
  makeGoods,
  makePriceList,
  makeUser,
  mockGetResponses,
  resendBatchSend,
  resetMocks
} from "@src/__tests__/mocks";
import { beforeEach, describe, expect, test } from "bun:test";

import { checkFavorites } from "../check-favorites";

import type { User } from "@dns-markdown/types/user";

const lastPriceList = makePriceList({ createdAt: "2026-10-16T10:00:00.000Z" });

const user = makeUser({
  email: "user@example.com",
  favorites: [
    {
      _id: "fav-1",
      status: { createdAt: "", updatedAt: "", deleted: false, city: "samara" },
      item: makeGoods({ link: "/fav/", price: "800" })
    }
  ]
});

describe("checkFavorites", () => {
  beforeEach(() => {
    resetMocks();
    mockGetResponses({
      "/api/pricelist": lastPriceList,
      "/api/analysis/all-analysis-goods-by-date-added": [
        makeAnalysisData({ link: "/fav/", price: "700" })
      ],
      "/service/all-notification-users": [structuredClone(user)]
    });
  });

  test("throws without CITY", async () => {
    env.CITY = undefined;

    await expect(checkFavorites()).rejects.toThrow("No city found");
    expect(apiGet).not.toHaveBeenCalled();
  });

  test("throws when there is no last price list", async () => {
    mockGetResponses({ "/api/pricelist": null });

    await expect(checkFavorites()).rejects.toThrow("No last price list found");
    expect(resendBatchSend).not.toHaveBeenCalled();
  });

  test("emails users about changed favorites and saves the updated favorites", async () => {
    await checkFavorites();

    expect(apiGet).toHaveBeenCalledWith("/api/analysis/all-analysis-goods-by-date-added", {
      params: { city: "samara", dateAdded: lastPriceList.createdAt }
    });
    expect(apiGet).toHaveBeenCalledWith("/service/all-notification-users", {
      params: { city: "samara" }
    });

    const [emails] = resendBatchSend.mock.calls[0] as [{ to: string[]; html: string }[]];
    expect(emails.map(email => email.to)).toEqual([["user@example.com"]]);
    expect(emails[0]?.html).toContain("Текущая цена: 700 руб.");

    const [endpoint, body] = apiPost.mock.calls[0] ?? [];
    expect(endpoint).toBe("/service/update-users-favorites");
    expect((body as { users: User[] }).users[0]?.favorites[0]?.item.price).toBe("700");
  });
});
