export type { AnalysisData } from "@dns-markdown/types/analysis-data";

export type AnalysisChangesByDates = {
  date: string;
  sold: number;
  new: number;
  profitChanged: number;
  pricesChanged: number;
}[];
