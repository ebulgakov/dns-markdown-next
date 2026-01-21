import type { Goods } from "#types/pricelist.ts";

export type AnalysisData = Goods & {
  city: string;
  category: string;
  dateAdded: string;
};
