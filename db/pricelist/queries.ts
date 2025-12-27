import { dbConnect } from "@/db/database";
import { getUser } from "@/db/profile/queries";
import { HourlyPricelist, Pricelist } from "@/db/models/pricelist_model";
import { History } from "@/db/models/history_model";
import { RemovedGoods } from "@/db/models/removed_goods_model";
import { Diff } from "@/db/models/diff_model";
import type { PriceList as PriceListType, RemovedGoods as RemovedGoodsType } from "@/types/pricelist";
import type { History as HistoryType } from "@/types/history";
import type { Diff as DiffType } from "@/types/diff";

export const getLastPriceList = async () => {
  await dbConnect();
  const user = await getUser();

  if (!user) return;

  return HourlyPricelist.findOne(
    { city: user.city },
    {},
    { sort: { updatedAt: -1 } }
  ) as unknown as PriceListType | undefined;
};

export const getArchiveList = async () => {
  await dbConnect();
  const user = await getUser();

  if (!user) return;

  return Pricelist.find({ city: user.city }, {}, { sort: { updatedAt: 1 } }).select(
    "createdAt"
  ) as unknown as PriceListType[] | undefined;
};

export const getPriceListById = async (id: string) => {
  await dbConnect();
  return Pricelist.findOne({ _id: id }) as unknown as PriceListType | undefined;
};

export const getProductById = async (id: string) => {
  await dbConnect();

  const history = (await History.findOne(
    { link: id },
    {},
    { sort: { updatedAt: -1 } }
  )) as unknown as HistoryType | undefined;
  if (!history) return;

  const priceList = (await HourlyPricelist.findOne(
    { city: history.city },
    {},
    { sort: { updatedAt: -1 } }
  )) as unknown as PriceListType | undefined;

  if (!priceList) return;

  const positions = priceList
    .toObject()
    .positions.flatMap((positionGroup) => positionGroup.items);
  const item = positions.find((position: { link: string }) => position.link === id);

  if (!item) return;

  item.city = history.city; // Added city specially for adding to favorites

  return { item, history };
};

export const getPriceListsDiff = async () => {
  await dbConnect();
  const user = await getUser();

  if (!user) return;

  const sold = await RemovedGoods.findOne({ city: user.city }, {}, { sort: { updatedAt: -1 } }) as unknown as RemovedGoodsType | undefined;
  const diff = await Diff.findOne({ city: user.city }, {}, { sort: { updatedAt: -1 } }) as unknown as DiffType | undefined;

  return { diff, sold };
};
