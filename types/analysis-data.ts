import type { Goods } from "./pricelist";

export type AnalysisData = Goods & {
  city: string;
  category: string;
  dateAdded: string;
};
