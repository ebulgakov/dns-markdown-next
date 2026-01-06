import type { PriceList } from "#types/pricelist.js";
import type { History } from "#types/history.js";

export default function makeHistory(priceLists: PriceList[]): History[] {
  const history: History[] = [];
  const flatCatalog = priceLists.map(pricelist =>
    pricelist.positions.flatMap(position => position.items.flat())
  );

  const [lastCatalog, ...prevCatalogs] = flatCatalog;

  for (let i = 0; i < lastCatalog.length; i++) {
    const lastItem = lastCatalog[i];
    const historyEntry: History = {
      link: lastItem.link,
      city: priceLists[0].city,
      labels: [priceLists[0].createdAt],
      priceOld: [lastItem.priceOld],
      price: [lastItem.price],
      profit: [lastItem.profit]
    };

    for (let j = 0; j < prevCatalogs.length; j++) {
      const prevItem = prevCatalogs[j].find(item => item.link === lastItem.link);
      if (prevItem) {
        historyEntry.labels.unshift(priceLists[j + 1].createdAt);
        historyEntry.priceOld.unshift(prevItem.priceOld);
        historyEntry.price.unshift(prevItem.price);
        historyEntry.profit.unshift(prevItem.profit);
      }
    }

    history.push(historyEntry);
  }

  return history;
}
