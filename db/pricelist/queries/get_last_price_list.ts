import { Pricelist } from "#db/models/pricelist_model.js";
import type { PriceList as PriceListType } from "#types/pricelist.ts";

export const getLastPriceList = async (city: string): Promise<PriceListType | null> => {
  return Pricelist.findOne({ city }, {}, { sort: { updatedAt: -1 } });
};
