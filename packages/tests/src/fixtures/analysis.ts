import { makeGoods } from "./goods";

import type { AnalysisData } from "@dns-markdown/types/analysis-data";
import type { AnalysisDiff } from "@dns-markdown/types/analysis-diff";

export const makeAnalysisData = (overrides: Partial<AnalysisData> = {}): AnalysisData => ({
  ...makeGoods(),
  city: "samara",
  category: "Смартфоны",
  dateAdded: "2026-10-16T10:00:00.000Z",
  ...overrides
});

export const makeAnalysisDiff = (overrides: Partial<AnalysisDiff> = {}): AnalysisDiff => ({
  city: "samara",
  dateAdded: "2026-10-16T10:00:00.000Z",
  newItems: [],
  removedItems: [],
  changesPrice: [],
  changesProfit: [],
  ...overrides
});
