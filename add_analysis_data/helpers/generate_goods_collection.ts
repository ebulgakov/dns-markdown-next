import type { PriceList } from "#types/pricelist.ts";
import type { AnalysisData } from "#types/analysis-data.ts";
import { ObjectId } from "mongodb";

export default function generateGoodsCollection(
  priceLists: PriceList[],
  city: string
): AnalysisData[] {
  const collection: AnalysisData[] = [];

  for (const priceList of priceLists) {
    for (const category of priceList.positions) {
      for (const item of category.items) {
        collection.push({
          _id: new ObjectId().toHexString(),
          title: item.title,
          link: item.link,
          description: item.description,
          reasons: item.reasons.map(reason => ({
            _id: new ObjectId().toHexString(),
            label: reason.label,
            text: reason.text
          })),
          priceOld: item.priceOld,
          price: item.price,
          profit: item.profit,
          code: item.code,
          image: item.image,
          available: item.available,
          city: city,
          category: category.title,
          dateAdded: priceList.createdAt
        });
      }
    }
  }

  return collection;
}
