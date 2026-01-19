import { formatDateShort } from "@/app/helpers/format";
import { getFlatPriceList } from "@/app/helpers/pricelist";
import { get as cacheGet, add as cacheAdd } from "@/cache";
import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";

import type { PriceList, PriceListsArchiveCount } from "@/types/pricelist";

export const getArchiveGoodsCount = async (city: string, date: string) => {
  if (!city || !date) throw new Error("city|date is required");

  const key = `pricelist:archive-goods-count:${String(city)}-${date}`;
  const cached = await cacheGet<PriceListsArchiveCount[]>(key);
  if (cached) return cached;

  await dbConnect();

  const archive = (await Pricelist.find({ city }, {}, { sort: { updatedAt: 1 } })) as PriceList[];

  const goodsCountByDates: PriceListsArchiveCount[] = archive.map(priceList => {
    return {
      date: formatDateShort(priceList.createdAt),
      count: getFlatPriceList(priceList).length
    };
  });

  await cacheAdd(key, JSON.stringify(goodsCountByDates), { ex: 60 * 60 * 24 }); // 24 hours

  return goodsCountByDates;
};
