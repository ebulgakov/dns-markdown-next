import redis from "@/cache";
import { dbConnect } from "@/db/database";
import { Diff } from "@/db/models/diff-model";
import { RemovedGoods, NewGoods } from "@/db/models/mutated-goods-model";

import type { Diff as DiffType } from "@/types/diff";
import type { RemovedGoods as RemovedGoodsType } from "@/types/pricelist";

export const getPriceListsDiff = async (city: string) => {
  if (!city) throw new Error("city is required");

  // Check cache first
  const soldKey = `pricelist:removed:${String(city)}`;
  const newKey = `pricelist:new:${String(city)}`;
  const diffKey = `pricelist:diff:${String(city)}`;
  let cachedSold = (await redis.get(soldKey)) as RemovedGoodsType | null;
  let cachedNew = (await redis.get(newKey)) as RemovedGoodsType | null;
  let cachedDiff = (await redis.get(diffKey)) as DiffType | null;

  // If any of the caches are missing, connect to DB and fetch
  if (!cachedSold || !cachedNew || !cachedDiff) {
    await dbConnect();
  }

  // Fetch missing data and update cache
  if (!cachedSold) {
    const sold = await RemovedGoods.findOne({ city }, {}, { sort: { updatedAt: -1 } });
    if (sold) {
      const plainSold = JSON.stringify(sold);
      await redis.set(soldKey, plainSold);
      cachedSold = JSON.parse(plainSold) as RemovedGoodsType;
    }
  }

  if (!cachedDiff) {
    const diff = await Diff.findOne({ city }, {}, { sort: { updatedAt: -1 } });
    if (diff) {
      const plainDiff = JSON.stringify(diff);
      await redis.set(diffKey, plainDiff);
      cachedDiff = JSON.parse(plainDiff) as DiffType;
    }
  }
  if (!cachedNew) {
    const newGoods = await NewGoods.findOne({ city }, {}, { sort: { updatedAt: -1 } });
    if (newGoods) {
      const plainNew = JSON.stringify(newGoods);
      await redis.set(newKey, plainNew);
      cachedNew = JSON.parse(plainNew) as RemovedGoodsType;
    }
  }

  // Return the assembled data
  return { diff: cachedDiff, sold: cachedSold, new: cachedNew };
};
