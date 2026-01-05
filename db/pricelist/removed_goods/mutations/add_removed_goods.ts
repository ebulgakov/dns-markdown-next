import { RemovedGoods } from "../../../models/removed_goods_model.ts";
import { type Goods } from "../../../../types/pricelist.ts";

export const addRemovedGoods = async (city: string, goods: Goods[]) => {
  const newRemovedGoods = new RemovedGoods({ city, goods });
  await newRemovedGoods.save();
  return newRemovedGoods;
};
