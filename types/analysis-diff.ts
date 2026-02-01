import type { AnalysisData } from "./analysis-data.js";

export type Diff = {
  priceOld: string;
  price: string;
  profit: string;
};

export type DiffDetail = {
  item: AnalysisData;
  diff: Diff;
};

export type DiffHistory = (Diff & { dateAdded: string })[];

export type AnalysisDiff = {
  city: string;
  dateAdded: string;
  newItems: AnalysisData[];
  removedItems: AnalysisData[];
  changesPrice: DiffDetail[];
  changesProfit: DiffDetail[];
};

export type AnalysisDiffReport = {
  city: string;
  dateAdded: string;
  newItems: number;
  removedItems: number;
  changesPrice: number;
  changesProfit: number;
};
