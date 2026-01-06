import { RemovedGoods, NewGoods } from "#db/models/mutated_goods_model.js";

export const removeRemovedGoods = (city: string) => {
  return RemovedGoods.deleteOne({ city });
};
export const removeNewGoods = (city: string) => {
  return NewGoods.deleteOne({ city });
};
