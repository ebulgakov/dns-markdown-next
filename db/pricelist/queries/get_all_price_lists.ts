import { Pricelist } from "../../models/pricelist_model.ts";
import type { PriceList as PriceListType } from "../../../types/pricelist.ts";

export const getAllPriceLists = async (city: string): Promise<PriceListType[] | []> => {
  return Pricelist.find({ city }, {}, { sort: { updatedAt: -1 } });
};
