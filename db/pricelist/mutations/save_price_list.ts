import { Pricelist } from "../../models/pricelist_model.ts";
import { type Goods } from "../../../types/pricelist.ts";

export const savePriceList = async (city: string, positions: Goods[]) => {
  const priceList = new Pricelist({
    city,
    positions
  });
  await priceList.save();
  return priceList;
};
