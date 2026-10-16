import { makeGoods, makePriceList } from "@src/__tests__/mocks";
import { describe, expect, test } from "bun:test";

import generateGoodsCollection from "../generate-goods-collection";

describe("generateGoodsCollection", () => {
  test("flattens all positions of all price lists with city, category and dateAdded", () => {
    const priceLists = [
      makePriceList({
        createdAt: "2026-10-16T10:00:00.000Z",
        positions: [
          { _id: "p1", title: "Смартфоны", items: [makeGoods({ link: "/a/" })] },
          {
            _id: "p2",
            title: "Ноутбуки",
            items: [makeGoods({ link: "/b/" }), makeGoods({ link: "/c/" })]
          }
        ]
      }),
      makePriceList({
        createdAt: "2026-10-15T10:00:00.000Z",
        positions: [{ _id: "p3", title: "Смартфоны", items: [makeGoods({ link: "/d/" })] }]
      })
    ];

    const result = generateGoodsCollection(priceLists, "moscow");

    expect(result.map(item => [item.link, item.category, item.dateAdded])).toEqual([
      ["/a/", "Смартфоны", "2026-10-16T10:00:00.000Z"],
      ["/b/", "Ноутбуки", "2026-10-16T10:00:00.000Z"],
      ["/c/", "Ноутбуки", "2026-10-16T10:00:00.000Z"],
      ["/d/", "Смартфоны", "2026-10-15T10:00:00.000Z"]
    ]);
    expect(result.every(item => item.city === "moscow")).toBe(true);
  });

  test("copies goods fields and generates fresh ids for items and reasons", () => {
    const goods = makeGoods();
    const [item] = generateGoodsCollection(
      [makePriceList({ positions: [{ _id: "p", title: "Смартфоны", items: [goods] }] })],
      "samara"
    );

    expect(item).toMatchObject({
      title: goods.title,
      link: goods.link,
      description: goods.description,
      priceOld: goods.priceOld,
      price: goods.price,
      profit: goods.profit,
      code: goods.code,
      image: goods.image,
      available: goods.available
    });
    expect(item?._id).not.toBe(goods._id);
    expect(item?._id).toMatch(/^[0-9a-f]{24}$/);
    expect(item?.reasons[0]).toMatchObject({ label: "Внешний вид", text: "Царапины" });
    expect(item?.reasons[0]?._id).not.toBe(goods.reasons[0]?._id);
  });

  test("returns an empty collection for no price lists", () => {
    expect(generateGoodsCollection([], "samara")).toEqual([]);
  });
});
