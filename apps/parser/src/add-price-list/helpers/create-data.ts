import * as cheerio from "cheerio";
import { ObjectId } from "mongodb";

import type { Goods, Position } from "@dns-markdown/types/pricelist";

export type SourcePrice = {
  id: string;
  data: { id: string; price: { previous: number; current: number } };
};

export type PricesSet = {
  states: SourcePrice[];
};

export default function createData(html: string, pricesSet: PricesSet) {
  const $ = cheerio.load(html);

  const list: Position[] = [];

  $(".markdown-page__group-title").each((_, $title) => {
    const $$title = $($title);
    const obj = {
      _id: new ObjectId().toHexString(),
      title: $$title.text().trim(),
      items: []
    } as Position;

    const $products = $$title.next().find(".catalog-products .catalog-product");

    $products.each((_, $product) => {
      const $$product = $($product);
      const productObj: Goods = {
        _id: new ObjectId().toHexString(),
        title: "",
        link: "",
        description: "",
        reasons: [],
        priceOld: "",
        price: "",
        profit: "",
        code: "",
        image: "",
        available: ""
      };

      // Metadata
      const $$title = $$product.find(".catalog-product__name").first();
      const titleWithDescriptionString = $$title.find("span").text() || "";
      const titleWithDescription = titleWithDescriptionString?.split(" [") || ["", ""];
      productObj.title = `${titleWithDescription[0] ?? ""}`.trim();
      productObj.description = "";
      productObj.link = $$title.attr("href") || "";
      productObj.code = `${$$product.data("code")}`;
      productObj.image =
        $$product.find("picture").first().find("img").first().attr("data-src") || "";
      productObj.available = $$product.find(".available").next().text();

      // Reasons
      productObj.reasons = [];
      const $$reasons = $$product.find(".catalog-product__spec");
      $$reasons.each((_, $reason) => {
        const $$reason = $($reason);
        const label = $$reason.find(".catalog-product__spec-label").text();
        const text = $$reason.find(".catalog-product__spec-value").text();
        productObj.reasons.push({
          _id: new ObjectId().toHexString(),
          label: `${label}`.trim(),
          text: `${text}`.trim()
        });
      });

      // Prices
      const productId = $$product.find(".catalog-product__buy").attr("id") as string;
      const prices = pricesSet.states.find(state => state.id === productId);
      if (prices) {
        productObj.priceOld = String(prices.data.price.previous);
        productObj.price = String(prices.data.price.current);
        if (productObj.priceOld && productObj.price) {
          productObj.profit = String(Number(productObj.priceOld) - Number(productObj.price));
        }
      }

      // Add product if it has required fields
      if (productObj.title && productObj.link && productObj.price && productObj.available) {
        obj.items.push(productObj);
      }
    });

    list.push(obj);
  });

  return list.reduce((acc, current) => {
    const existing = acc.find(item => item.title === current.title);
    if (existing) {
      existing.items.push(...current.items);
    } else {
      acc.push(current);
    }
    return acc;
  }, [] as Position[]);
}
