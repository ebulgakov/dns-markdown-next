import { describe, expect, test } from "bun:test";

import createData from "../create-data";

import type { PricesSet } from "../create-data";

type ProductFixture = {
  buyId: string;
  name?: string;
  href?: string;
  code?: string;
  image?: string;
  available?: string;
  specs?: [string, string][];
};

const product = ({
  buyId,
  name = "Phone X [8/128 GB, black]",
  href = "/product/phone-x/",
  code = "111",
  image = "https://img.test/phone-x.jpg",
  available = "В наличии",
  specs = []
}: ProductFixture) => `
  <div class="catalog-product" data-code="${code}">
    <picture><img data-src="${image}" /></picture>
    <a class="catalog-product__name" href="${href}"><span>${name}</span></a>
    ${specs
      .map(
        ([label, value]) => `
      <div class="catalog-product__spec">
        <span class="catalog-product__spec-label"> ${label} </span>
        <span class="catalog-product__spec-value"> ${value} </span>
      </div>`
      )
      .join("")}
    <span class="available"></span><span>${available}</span>
    <div class="catalog-product__buy" id="${buyId}"></div>
  </div>`;

const group = (title: string, products: string[]) => `
  <div class="markdown-page__group-title"> ${title} </div>
  <div><div class="catalog-products">${products.join("")}</div></div>`;

const prices = (...states: [string, number, number][]): PricesSet => ({
  states: states.map(([id, previous, current]) => ({
    id,
    data: { id, price: { previous, current } }
  }))
});

describe("createData", () => {
  test("parses groups and products with prices, profit and reasons", () => {
    const html = group("Смартфоны", [
      product({ buyId: "buy-1", specs: [["Внешний вид", "Царапины"]] })
    ]);

    const result = createData(html, prices(["buy-1", 1000, 800]));

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Смартфоны");
    expect(result[0]?.items).toHaveLength(1);
    expect(result[0]?.items[0]).toMatchObject({
      title: "Phone X",
      description: "",
      link: "/product/phone-x/",
      code: "111",
      image: "https://img.test/phone-x.jpg",
      available: "В наличии",
      priceOld: "1000",
      price: "800",
      profit: "200",
      reasons: [{ label: "Внешний вид", text: "Царапины" }]
    });
    expect(result[0]?.items[0]?._id).toMatch(/^[0-9a-f]{24}$/);
  });

  test("merges groups with the same title", () => {
    const html =
      group("Смартфоны", [product({ buyId: "buy-1", href: "/p/1/" })]) +
      group("Ноутбуки", [product({ buyId: "buy-2", href: "/p/2/" })]) +
      group("Смартфоны", [product({ buyId: "buy-3", href: "/p/3/" })]);

    const result = createData(
      html,
      prices(["buy-1", 100, 90], ["buy-2", 200, 150], ["buy-3", 300, 250])
    );

    expect(result.map(position => position.title)).toEqual(["Смартфоны", "Ноутбуки"]);
    expect(result[0]?.items.map(item => item.link)).toEqual(["/p/1/", "/p/3/"]);
  });

  test("drops products without a price", () => {
    const html = group("Смартфоны", [
      product({ buyId: "buy-1", href: "/p/1/" }),
      product({ buyId: "buy-unpriced", href: "/p/2/" })
    ]);

    const result = createData(html, prices(["buy-1", 100, 90]));

    expect(result[0]?.items.map(item => item.link)).toEqual(["/p/1/"]);
  });

  test("drops products without title, link or availability", () => {
    const html = group("Смартфоны", [
      product({ buyId: "buy-1", name: "" }),
      product({ buyId: "buy-2", href: "" }),
      product({ buyId: "buy-3", available: "" })
    ]);

    const result = createData(html, prices(["buy-1", 1, 1], ["buy-2", 1, 1], ["buy-3", 1, 1]));

    expect(result[0]?.items).toEqual([]);
  });

  test("keeps the whole name when there is no description in brackets", () => {
    const html = group("Смартфоны", [product({ buyId: "buy-1", name: "Phone Y" })]);

    const result = createData(html, prices(["buy-1", 100, 90]));

    expect(result[0]?.items[0]?.title).toBe("Phone Y");
  });

  test("returns an empty list for a page without groups", () => {
    expect(createData("<html></html>", prices())).toEqual([]);
  });
});
