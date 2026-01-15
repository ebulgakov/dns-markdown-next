import { AnalysisDiff } from "#db/models/analysis_diff.js";

export const removeAllAnalysisDiff = (city: string) => {
  return AnalysisDiff.deleteMany({ city });
};
