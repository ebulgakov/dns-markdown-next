import { RemovedGoods, NewGoods } from "../../../models/mutated_goods_model.ts";
import { type Goods } from "../../../../types/pricelist.ts";

export const addRemovedGoods = async (city: string, goods: Goods[]) => {
  const newRemovedGoods = new RemovedGoods({ city, goods });
  await newRemovedGoods.save();
  return newRemovedGoods;
};

export const addNewGoods = async (city: string, goods: Goods[]) => {
  const newRemovedGoods = new NewGoods({ city, goods });
  await newRemovedGoods.save();
  return newRemovedGoods;
};
