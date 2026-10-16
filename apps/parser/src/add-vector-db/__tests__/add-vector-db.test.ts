import {
  apiGet,
  env,
  makeGoods,
  makePriceList,
  mockGetResponses,
  resetMocks
} from "@src/__tests__/mocks";
import { beforeEach, describe, expect, mock, spyOn, test } from "bun:test";

type UpsertPayload = {
  id: string;
  data: string;
  metadata: Record<string, unknown>;
};

const info = mock(async () => ({}));
const reset = mock<(options?: unknown) => Promise<void>>(async () => {});
const upsert = mock<(payload: UpsertPayload) => Promise<void>>(async () => {});
const IndexMock = mock<(config: unknown) => unknown>(() => ({ info, reset, upsert }));

const spinner = { text: "", start: () => spinner, succeed: mock(), fail: mock() };

mock.module("@upstash/vector", () => ({ Index: IndexMock }));
mock.module("ora", () => ({ default: () => spinner }));

// Imported after the SDK mocks so the stage picks them up
const { addVectorDb } = await import("../add-vector-db");

const lastPriceList = makePriceList({
  createdAt: "2026-10-16T10:00:00.000Z",
  positions: [
    {
      _id: "p1",
      title: "Смартфоны",
      items: [
        makeGoods({
          link: "/product/phone/",
          title: "Phone",
          description: "[8/128 GB]\nblack",
          price: "800",
          priceOld: "1000",
          profit: "200"
        }),
        makeGoods({ link: "/product/tablet/", reasons: [], priceOld: "", profit: "" })
      ]
    }
  ]
});

describe("addVectorDb", () => {
  beforeEach(() => {
    resetMocks();
    for (const fn of [info, reset, upsert, IndexMock, spinner.succeed, spinner.fail]) {
      fn.mockClear();
    }
    info.mockImplementation(async () => ({}));
    mockGetResponses({ "/api/pricelist": lastPriceList });
  });

  test("throws without CITY", async () => {
    env.CITY = undefined;

    await expect(addVectorDb()).rejects.toThrow("No city found");
    expect(IndexMock).not.toHaveBeenCalled();
  });

  test("resets the index and upserts every item of the last price list", async () => {
    await addVectorDb();

    expect(IndexMock).toHaveBeenCalledWith({
      url: env.UPSTASH_VECTOR_REST_URL,
      token: env.UPSTASH_VECTOR_REST_TOKEN
    });
    expect(apiGet).toHaveBeenCalledWith("/api/pricelist", { params: { city: "samara" } });
    expect(reset).toHaveBeenCalledWith({ all: true });
    expect(upsert).toHaveBeenCalledTimes(2);

    const phone = upsert.mock.calls[0]?.[0];
    expect(phone?.id).toBe("/product/phone/");
    expect(phone?.data).toContain("Категория: Смартфоны.");
    expect(phone?.data).toContain("Характеристики: 8/128 GB black.");
    expect(phone?.data).toContain("Состояние и причины уценки: Внешний вид: Царапины.");
    expect(phone?.data).not.toMatch(/\s{2,}/);
    expect(phone?.metadata).toMatchObject({
      title: "Phone",
      category: "Смартфоны",
      price: 800,
      priceOld: 1000,
      profit: 200,
      link: "https://dns-shop.ru/product/phone/",
      createdAt: lastPriceList.createdAt
    });

    const tablet = upsert.mock.calls[1]?.[0];
    expect(tablet?.metadata).toMatchObject({ priceOld: 0, profit: 0 });
    expect(spinner.succeed).toHaveBeenCalled();
  });

  test("tags vectors with the city being indexed", async () => {
    env.CITY = "moscow";

    await addVectorDb();

    expect(upsert.mock.calls.map(([payload]) => payload.metadata.city)).toEqual([
      "moscow",
      "moscow"
    ]);
  });

  test("fails when the vector DB is unreachable", async () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    info.mockImplementation(async () => {
      throw new Error("unreachable");
    });

    await expect(addVectorDb()).rejects.toThrow("unreachable");
    expect(spinner.fail).toHaveBeenCalledWith("Failed to connect to Vector DB.");
    expect(reset).not.toHaveBeenCalled();
    error.mockRestore();
  });

  test("throws when there is no price list for the city", async () => {
    mockGetResponses({ "/api/pricelist": null });

    await expect(addVectorDb()).rejects.toThrow("No price list found for city");
    expect(reset).not.toHaveBeenCalled();
  });
});
