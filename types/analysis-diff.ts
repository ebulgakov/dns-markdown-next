import type { AnalysisData } from "@/types/analysis-data.js";
import type { CustomDate } from "@/types/common";

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

export type DiffHistory = (Diff & { dateAdded: CustomDate })[];

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
