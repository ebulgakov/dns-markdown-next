import type { Goods } from "@/entities/product";

export type AnalysisData = Goods & {
  city: string;
  category: string;
  dateAdded: string;
};

export type AnalysisChangesByDates = {
  date: string;
  sold: number;
  new: number;
  profitChanged: number;
  pricesChanged: number;
}[];
