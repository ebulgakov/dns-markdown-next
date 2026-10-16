import { AnalysisData } from "@dns-markdown/db/models/analysis-data";
import { Pricelist } from "@dns-markdown/db/models/pricelist";

import type { Goods, PriceList as PriceListType } from "@dns-markdown/db/types/pricelist";

export const getLastPriceList = async (city: string): Promise<PriceListType | null> =>
  Pricelist.findOne({ city }, {}, { sort: { updatedAt: -1 } })
    .lean()
    .exec();

export const getLastPriceListFlat = async (city: string): Promise<Goods[]> => {
  const priceList = await getLastPriceList(city);
  if (!priceList) return [];
  return priceList.positions.flatMap(position => position.items);
};

export const getLastPriceListWithDates = async (city: string): Promise<PriceListType | null> => {
  const priceList = await getLastPriceList(city);
  if (!priceList) return null;

  const links = [
    ...new Set(priceList.positions.flatMap(position => position.items.map(item => item.link)))
  ];

  const dateAddedResults = links.length
    ? ((await AnalysisData.aggregate([
        { $match: { city, link: { $in: links } } },
        { $group: { _id: "$link", dateAdded: { $min: "$dateAdded" } } }
      ])) as { _id: string; dateAdded: string }[])
    : [];

  const dateAddedByLink = new Map(dateAddedResults.map(entry => [entry._id, entry.dateAdded]));

  return {
    ...priceList,
    positions: priceList.positions.map(position => ({
      ...position,
      items: position.items.map(item => ({
        ...item,
        dateAdded: dateAddedByLink.get(item.link) ?? null
      }))
    }))
  };
};
