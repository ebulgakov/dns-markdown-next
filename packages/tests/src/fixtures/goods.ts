import type { Goods } from "@dns-markdown/types/pricelist";

export const makeGoods = (overrides: Partial<Goods> = {}): Goods => ({
  _id: "goods-id",
  title: "Phone",
  link: "/product/phone/",
  description: "Black, 128 GB",
  reasons: [{ _id: "reason-id", label: "Внешний вид", text: "Царапины" }],
  priceOld: "1000",
  price: "800",
  profit: "200",
  code: "12345",
  image: "https://img.test/phone.jpg",
  available: "В наличии",
  ...overrides
});
