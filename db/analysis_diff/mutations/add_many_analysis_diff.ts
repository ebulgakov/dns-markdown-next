import { AnalysisDiff } from "#db/models/analysis_diff_model.ts";
import type { AnalysisDiff as AnalysisDiffType } from "#types/analysis_diff.ts";

export const addManyAnalysisDiff = async (diff: AnalysisDiffType[]) => {
  return AnalysisDiff.insertMany(diff);
};
