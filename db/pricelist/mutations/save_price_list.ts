import { Pricelist } from "#db/models/pricelist_model.ts";
import type { Position } from "#types/pricelist.ts";

export const savePriceList = async (city: string, positions: Position[]) => {
  const priceList = new Pricelist({
    city,
    positions
  });
  await priceList.save();
  return priceList;
};
