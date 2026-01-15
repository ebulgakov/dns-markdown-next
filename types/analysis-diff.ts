import type { AnalysisData } from "@/types/analysis-data.js";

export type Diff = {
  priceOld: string;
  price: string;
  profit: string;
};

export type DiffsCollection = { [key: string]: Diff };

export type DiffDetail = {
  item: AnalysisData;
  diff: Diff;
};

export type AnalysisDiff = {
  city: string;
  dateAdded: string;
  newItems: AnalysisData[];
  removedItems: AnalysisData[];
  changesPrice: DiffDetail[];
  changesProfit: DiffDetail[];
};
