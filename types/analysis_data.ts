import type { Goods } from "@/types/pricelist";

export type AnalysisData = Goods & {
  city: string;
  category: string;
  dateAdded: string;
};
