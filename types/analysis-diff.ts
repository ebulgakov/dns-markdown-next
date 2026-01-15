import type { AnalysisData } from "@/types/analysis-data.js";

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
