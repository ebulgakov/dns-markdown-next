import { PriceList } from "@/entities/product";
import { AnalysisDiff, DiffsCollection as DiffsType } from "@/types/analysis-diff";

const transformDiffData = (diff: AnalysisDiff, city: string) => {
  const digestList: PriceList = {
    _id: "digest",
    city,
    createdAt: diff.dateAdded,
    positions: [
      {
        _id: "new-items",
        title: "Новые поступления",
        items: diff.newItems
      },
      {
        _id: "change-price-items",
        title: "Изменения цены",
        items: diff.changesPrice.map(({ item }) => item)
      },
      {
        _id: "removed-items",
        title: "Продано на сегодня",
        items: diff.removedItems
      },
      {
        _id: "change-profit-items",
        title: "Изменения Выгоды",
        items: diff.changesProfit.map(({ item }) => item)
      }
    ]
  };

  const diffs = [...diff.changesPrice, ...diff.changesProfit].reduce((acc, item) => {
    acc[`${item.item._id}`] = item.diff;
    return acc;
  }, {} as DiffsType);

  return { diffs, digestList };
};

export { transformDiffData };
