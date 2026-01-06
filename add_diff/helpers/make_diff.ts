import type { PriceList } from "../../types/pricelist.ts";
import { type GoodsDiff } from "../../types/diff.ts";

export default function makeDiff(
  last: PriceList,
  prev: PriceList
): {
  changesPrice: GoodsDiff[];
  changesProfit: GoodsDiff[];
} {
  const result = {
    changesPrice: [],
    changesProfit: []
  };

  const flatLastCatalog = last.positions.flatMap(position => position.items.flat());
  const flatPrevCatalog = prev.positions.flatMap(position => position.items.flat());

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
    }
  }

  return result;
}
