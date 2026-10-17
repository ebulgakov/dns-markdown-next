import type { Diff } from "@dns-markdown/types/analysis-diff";

export type {
  AnalysisDiff,
  AnalysisDiffReport,
  Diff,
  DiffDetail,
  DiffHistory
} from "@dns-markdown/types/analysis-diff";

export type DiffsCollection = { [key: string]: Diff };
