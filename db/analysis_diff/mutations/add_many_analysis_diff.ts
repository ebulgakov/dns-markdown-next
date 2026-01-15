import { AnalysisDiff } from "#db/models/analysis_diff.js";
import type { AnalysisDiff as AnalysisDiffType } from "#types/analysis_diff.js";

export const addManyAnalysisDiff = async (diff: AnalysisDiffType[]) => {
  return AnalysisDiff.insertMany(diff);
};
