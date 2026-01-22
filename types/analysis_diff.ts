import type { AnalysisData } from "#types/analysis_data.ts";

type DiffDetail = {
  item: AnalysisData;
  diff: {
    priceOld: string;
    price: string;
    profit: string;
  };
};

export type AnalysisDiff = {
  city: string;
  dateAdded: string;
  newItems: AnalysisData[];
  removedItems: AnalysisData[];
  changesPrice: DiffDetail[];
  changesProfit: DiffDetail[];
};
