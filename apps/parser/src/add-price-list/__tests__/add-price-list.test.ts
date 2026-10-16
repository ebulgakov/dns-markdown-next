import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  apiGet,
  env,
  makePriceList,
  mockGetResponses,
  postBody,
  postedEndpoints,
  resetMocks
} from "@src/__tests__/mocks";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";

import { addPriceList } from "../add-price-list";

import type { Position } from "@dns-markdown/db/types/pricelist";

const BODY_HTML = `
  <div class="markdown-page__group-title">Смартфоны</div>
  <div><div class="catalog-products">
    <div class="catalog-product" data-code="111">
      <a class="catalog-product__name" href="/product/phone/"><span>Phone [black]</span></a>
      <span class="available"></span><span>В наличии</span>
      <div class="catalog-product__buy" id="buy-1"></div>
    </div>
  </div></div>`;

const PRICES_HTML = JSON.stringify({
  data: {
    states: [{ id: "buy-1", data: { id: "buy-1", price: { previous: 1000, current: 800 } } }]
  }
});

// addPriceList reads `src/pages/` relative to cwd, so run it inside a temp dir with fixtures
const originalCwd = process.cwd();
let workDir: string;

const writePages = (body: string, prices = PRICES_HTML) => {
  writeFileSync(join(workDir, "src", "pages", "body.html"), body);
  writeFileSync(join(workDir, "src", "pages", "prices.html"), prices);
};

describe("addPriceList", () => {
  beforeAll(() => {
    workDir = mkdtempSync(join(tmpdir(), "parser-add-price-list-"));
    mkdirSync(join(workDir, "src", "pages"), { recursive: true });
    process.chdir(workDir);
  });

  afterAll(() => {
    process.chdir(originalCwd);
    rmSync(workDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    resetMocks();
    writePages(BODY_HTML);
  });

  test("throws without CITY", async () => {
    env.CITY = undefined;

    await expect(addPriceList()).rejects.toThrow("No city found");
    expect(apiGet).not.toHaveBeenCalled();
  });

  test("saves the parsed price list when the last one is from another day", async () => {
    // A calendar day back, not 24h: on a 25-hour DST day `now - 24h` can still be the same date
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const yesterday = date.toISOString();
    mockGetResponses({ "/api/pricelist": makePriceList({ createdAt: yesterday }) });

    await addPriceList();

    expect(apiGet).toHaveBeenCalledWith("/api/pricelist", { params: { city: "samara" } });
    expect(postedEndpoints()).toEqual(["/service/add-new-price-list"]);
    const { city, positions } = postBody("/service/add-new-price-list") as {
      city: string;
      positions: Position[];
    };
    expect(city).toBe("samara");
    expect(positions[0]?.title).toBe("Смартфоны");
    expect(positions[0]?.items[0]).toMatchObject({ title: "Phone", price: "800", profit: "200" });
  });

  test("replaces today's price list instead of adding a second one", async () => {
    mockGetResponses({ "/api/pricelist": makePriceList({ createdAt: new Date().toISOString() }) });

    await addPriceList();

    expect(postedEndpoints()).toEqual([
      "/service/delete-last-price-list",
      "/service/add-new-price-list"
    ]);
    expect(postBody("/service/delete-last-price-list")).toEqual({ city: "samara" });
  });

  test("throws when the pages contain no groups", async () => {
    writePages("<html></html>", JSON.stringify({ data: { states: [] } }));

    await expect(addPriceList()).rejects.toThrow("No price list data to add.");
    expect(postedEndpoints()).toEqual([]);
  });
});
