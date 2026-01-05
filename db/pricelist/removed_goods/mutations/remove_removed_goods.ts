import { RemovedGoods } from "../../../models/removed_goods_model.ts";

export const removeRemovedGoods = (city: string) => {
  return RemovedGoods.deleteOne({ city });
};
