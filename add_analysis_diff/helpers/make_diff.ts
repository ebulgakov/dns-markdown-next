import type { AnalysisData } from "#types/analysis-data.ts";
import type { AnalysisDiff } from "#types/analysis-diff.ts";

export default function makeDiff(
  flatLastCatalog: AnalysisData[],
  flatPrevCatalog: AnalysisData[],
  { city, dateAdded }: { city: string; dateAdded: string }
) {
  const result: AnalysisDiff = {
    newItems: [],
    removedItems: [],
    changesPrice: [],
    changesProfit: [],
    city,
    dateAdded
  };

  for (const lastItem of flatLastCatalog) {
    const prevItem = flatPrevCatalog.find(item => item.link === lastItem.link);

    if (prevItem) {
      const payload = {
        item: lastItem,
        diff: {
          priceOld: prevItem.priceOld,
          price: prevItem.price,
          profit: prevItem.profit
        }
      };

      if (lastItem.price !== prevItem.price) {
        result.changesPrice.push(payload);
      } else if (lastItem.profit !== prevItem.profit) {
        result.changesProfit.push(payload);
      }
    } else {
      result.newItems.push(lastItem);
    }
  }

  for (const prevItem of flatPrevCatalog) {
    const isItemInLast = flatLastCatalog.find(lastItem => lastItem.link === prevItem.link);
    if (!isItemInLast) result.removedItems.push(prevItem);
  }

  return result;
}
