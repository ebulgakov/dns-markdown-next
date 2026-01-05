import { RemovedGoods, NewGoods } from "../../models/mutated_goods_model.ts";

export const removeRemovedGoods = (city: string) => {
  return RemovedGoods.deleteOne({ city });
};
export const removeNewGoods = (city: string) => {
  return NewGoods.deleteOne({ city });
};
