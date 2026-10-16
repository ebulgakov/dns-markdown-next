import { makeAnalysisData } from "@src/__tests__/mocks";
import { describe, expect, test } from "bun:test";

import makeDiff from "../make-diff";

const meta = { city: "samara", dateAdded: "2026-10-16T10:00:00.000Z" };

describe("makeDiff", () => {
  test("detects new and removed items by link", () => {
    const kept = makeAnalysisData({ link: "/kept/" });
    const added = makeAnalysisData({ link: "/added/" });
    const removed = makeAnalysisData({ link: "/removed/" });

    const result = makeDiff([kept, added], [kept, removed], meta);

    expect(result.newItems).toEqual([added]);
    expect(result.removedItems).toEqual([removed]);
    expect(result.changesPrice).toEqual([]);
    expect(result.changesProfit).toEqual([]);
    expect(result).toMatchObject(meta);
  });

  test("records a price change with the previous prices", () => {
    const prev = makeAnalysisData({ link: "/x/", priceOld: "1000", price: "800", profit: "200" });
    const last = makeAnalysisData({ link: "/x/", priceOld: "1000", price: "700", profit: "300" });

    const result = makeDiff([last], [prev], meta);

    expect(result.changesPrice).toEqual([
      { item: last, diff: { priceOld: "1000", price: "800", profit: "200" } }
    ]);
    expect(result.changesProfit).toEqual([]);
  });

  test("records a profit change only when the price stayed the same", () => {
    const prev = makeAnalysisData({ link: "/x/", priceOld: "1000", price: "800", profit: "200" });
    const last = makeAnalysisData({ link: "/x/", priceOld: "1100", price: "800", profit: "300" });

    const result = makeDiff([last], [prev], meta);

    expect(result.changesPrice).toEqual([]);
    expect(result.changesProfit).toEqual([
      { item: last, diff: { priceOld: "1000", price: "800", profit: "200" } }
    ]);
  });

  test("ignores unchanged items", () => {
    const item = makeAnalysisData({ link: "/x/" });

    const result = makeDiff([item], [{ ...item }], meta);

    expect(result.newItems).toEqual([]);
    expect(result.removedItems).toEqual([]);
    expect(result.changesPrice).toEqual([]);
    expect(result.changesProfit).toEqual([]);
  });

  test("treats everything as new against an empty previous state", () => {
    const items = [makeAnalysisData({ link: "/a/" }), makeAnalysisData({ link: "/b/" })];

    const result = makeDiff(items, [], meta);

    expect(result.newItems).toEqual(items);
    expect(result.removedItems).toEqual([]);
  });
});
