import { RemovedGoods, NewGoods } from "#db/models/mutated_goods_model.js";
import type { Goods } from "#types/pricelist.js";

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
