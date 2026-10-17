import { makeGoods } from "./goods";

import type { PriceList } from "@dns-markdown/types/pricelist";

export const makePriceList = (overrides: Partial<PriceList> = {}): PriceList => ({
  _id: "pricelist-id",
  city: "samara",
  createdAt: "2026-10-16T10:00:00.000Z",
  positions: [{ _id: "position-id", title: "Смартфоны", items: [makeGoods()] }],
  ...overrides
});
