import * as cheerio from "cheerio";
import { ObjectId } from "mongodb";
import type { Goods } from "../types/pricelist.js";

type PricesSet = {
  states: {
    data: {
      id: string;
      price: {
        previous: number;
        current: number;
      };
    };
  }[];
};
export default function createData(html: string, pricesSet: PricesSet): Goods[] {
  const $ = cheerio.load(html);

  const list = [];

  $(".markdown-page__group-title").each((_, $title) => {
    const $$title = $($title);
    const obj = {
      title: $$title.text().trim(),
      items: []
    };

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
      const titleWithDescription = $$title.find("span").html().split("<br>");
      productObj.title = titleWithDescription[0];
      productObj.description = titleWithDescription[1];
      productObj.link = $$title.attr("href");
      productObj.code = `${$$product.data("code")}`;
      productObj.image = $$product.find("picture").first().find("img").first().attr("data-src");
      productObj.available = $$product.find(".available").next().text();

      // Reasons
      productObj.reasons = [];
      const $$reasons = $$product
        .find(".catalog-product__reasons")
        .children(".catalog-product__reasons-new-item");
      $$reasons.map((_, $reason) => {
        const $$reason = $($reason);
        const [label, text] = $$reason.text().split(": ");
        productObj.reasons.push({ _id: new ObjectId().toHexString(), label, text });
      });

      // Prices
      const productId = $$product.data("entity") as string;
      const prices = pricesSet.states.find(state => state.data.id === productId);
      productObj.priceOld = String(prices.data.price.previous);
      productObj.price = String(prices.data.price.current);
      if (productObj.priceOld && productObj.price) {
        productObj.profit = String(Number(productObj.priceOld) - Number(productObj.price));
      }

      // Add product if it has required fields
      if (productObj.title && productObj.link && productObj.price && productObj.available) {
        obj.items.push(productObj);
      }
    });

    list.push(obj);
  });

  return list;
}
