import { dbConnect } from "@/db/database";
import { Diff } from "@/db/models/diff-model";
import { RemovedGoods, NewGoods } from "@/db/models/mutated-goods-model";
import { getUser } from "@/db/user/queries";

import type { Diff as DiffType } from "@/types/diff";
import type { RemovedGoods as RemovedGoodsType } from "@/types/pricelist";



export const getPriceListsDiff = async () => {
  await dbConnect();
  const user = await getUser();

  if (!user) return null;

  const sold = (await RemovedGoods.findOne(
    { city: user.city },
    {},
    { sort: { updatedAt: -1 } }
  )) as unknown as RemovedGoodsType | null;

  const newGoods = (await NewGoods.findOne(
    { city: user.city },
    {},
    { sort: { updatedAt: -1 } }
  )) as unknown as RemovedGoodsType | null;
  const diff = (await Diff.findOne(
    { city: user.city },
    {},
    { sort: { updatedAt: -1 } }
  )) as unknown as DiffType | null;

  return { diff, sold, new: newGoods };
};
