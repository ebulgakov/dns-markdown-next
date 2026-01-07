import { Pricelist } from "#db/models/pricelist_model.js";
import type { PriceList as PriceListType } from "#types/pricelist.js";

export const getAllPriceLists = async (city: string): Promise<PriceListType[] | []> => {
  return Pricelist.find({ city }, {}, { sort: { updatedAt: -1 } });
};
