import { makeAnalysisData, makeGoods, makeUser } from "@src/__tests__/mocks";
import { describe, expect, test } from "bun:test";

import updateFavorites from "../update-favorites";

const userWithFavorite = ({ price = "800", deleted = false } = {}) =>
  makeUser({
    favorites: [
      {
        _id: "favorite-id",
        status: {
          createdAt: "2026-10-01T10:00:00.000Z",
          updatedAt: "2026-10-01T10:00:00.000Z",
          deleted,
          city: "samara"
        },
        item: makeGoods({ link: "/fav/", price, priceOld: "1000", profit: "200" })
      }
    ]
  });

describe("updateFavorites", () => {
  test("marks a favorite as deleted when it disappeared from the history", () => {
    const { users, statuses } = updateFavorites([userWithFavorite()], []);

    const favorite = users[0]?.favorites[0];
    expect(favorite?.status.deleted).toBe(true);
    expect(favorite?.status.updatedAt).not.toBe("2026-10-01T10:00:00.000Z");
    expect(statuses).toEqual([{ id: "favorite-id", status: ["availability"] }]);
  });

  test("marks a deleted favorite as available again when it is back", () => {
    const history = [makeAnalysisData({ link: "/fav/", price: "800" })];

    const { users, statuses } = updateFavorites([userWithFavorite({ deleted: true })], history);

    expect(users[0]?.favorites[0]?.status.deleted).toBe(false);
    expect(statuses).toEqual([{ id: "favorite-id", status: ["availability"] }]);
  });

  test("reports a price change and copies the new prices", () => {
    const history = [
      makeAnalysisData({ link: "/fav/", priceOld: "1100", price: "700", profit: "400" })
    ];

    const { users, statuses } = updateFavorites([userWithFavorite({ price: "800" })], history);

    expect(users[0]?.favorites[0]?.item).toMatchObject({
      priceOld: "1100",
      price: "700",
      profit: "400"
    });
    expect(statuses).toEqual([{ id: "favorite-id", status: ["price"] }]);
  });

  test("reports both availability and price when a deleted favorite returns cheaper", () => {
    const history = [makeAnalysisData({ link: "/fav/", price: "700" })];

    const { statuses } = updateFavorites(
      [userWithFavorite({ price: "800", deleted: true })],
      history
    );

    expect(statuses).toEqual([{ id: "favorite-id", status: ["availability", "price"] }]);
  });

  test("returns an empty status for an unchanged favorite", () => {
    const history = [makeAnalysisData({ link: "/fav/", price: "800" })];

    const { users, statuses } = updateFavorites([userWithFavorite({ price: "800" })], history);

    expect(users[0]?.favorites[0]?.status.updatedAt).toBe("2026-10-01T10:00:00.000Z");
    expect(statuses).toEqual([{ id: "favorite-id", status: [] }]);
  });

  test("falls back to '0' for missing prices in the history", () => {
    const history = [makeAnalysisData({ link: "/fav/", priceOld: "", price: "", profit: "" })];

    const { users } = updateFavorites([userWithFavorite()], history);

    expect(users[0]?.favorites[0]?.item).toMatchObject({ priceOld: "0", price: "0", profit: "0" });
  });
});
