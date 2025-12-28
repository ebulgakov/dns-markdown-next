import { dbConnect } from "@/db/database";
import { getUser } from "@/db/profile/queries";
import { RemovedGoods } from "@/db/models/removed_goods_model";
import type { RemovedGoods as RemovedGoodsType } from "@/types/pricelist";
import { Diff } from "@/db/models/diff_model";
import type { Diff as DiffType } from "@/types/diff";

export const getPriceListsDiff = async () => {
  await dbConnect();
  const user = await getUser();

  if (!user) return null;

  const sold = await RemovedGoods.findOne({ city: user.city }, {}, { sort: { updatedAt: -1 } }) as unknown as RemovedGoodsType | null;
  const diff = await Diff.findOne({ city: user.city }, {}, { sort: { updatedAt: -1 } }) as unknown as DiffType | null;

  return { diff, sold };
};
