import type { Goods } from "#types/pricelist.js";

export type AnalysisData = Goods & {
  city: string;
  category: string;
  dateAdded: string;
};
