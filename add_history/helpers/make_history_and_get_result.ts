import type { PriceList } from "#types/pricelist.ts";
import type { History } from "#types/history.ts";
import isSameDay from "#add_price_list/helpers/is_same_day.js";

export default function makeHistoryAndGetResult(
  priceList: PriceList,
  history: History[]
): {
  outdatedHistory: History[];
  updatedHistory: History[];
  newHistory: History[];
} {
  const outdatedHistory: History[] = [];
  const updatedHistory: History[] = [];
  const newHistory: History[] = [];
  const flatLastCatalog = priceList.positions.flatMap(position => position.items.flat());

  for (const historyItem of history) {
    const itemInLast = flatLastCatalog.find(lastItem => lastItem.link === historyItem.link);
    if (itemInLast) {
      const lastLabel = historyItem.labels[historyItem.labels.length - 1];
      if (isSameDay(new Date(priceList.createdAt), new Date(lastLabel))) {
        historyItem.labels.pop();
        historyItem.priceOld.pop();
        historyItem.price.pop();
        historyItem.profit.pop();
      }
      historyItem.labels.push(priceList.createdAt);
      historyItem.priceOld.push(itemInLast.priceOld);
      historyItem.price.push(itemInLast.price);
      historyItem.profit.push(itemInLast.profit);
      updatedHistory.push(historyItem);
    } else {
      outdatedHistory.push(historyItem);
    }
  }

  for (const lastItem of flatLastCatalog) {
    const isItemInHistory = history.find(historyItem => historyItem.link === lastItem.link);
    if (!isItemInHistory) {
      const newHistoryItem: History = {
        link: lastItem.link,
        city: priceList.city,
        labels: [priceList.createdAt],
        priceOld: [lastItem.priceOld],
        price: [lastItem.price],
        profit: [lastItem.profit]
      };
      newHistory.push(newHistoryItem);
    }
  }

  return { outdatedHistory, updatedHistory, newHistory };
}
