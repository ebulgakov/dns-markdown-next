import { AnalysisDiff } from "#db/models/analysis_diff_model.js";

export const removeAllAnalysisDiff = (city: string) => {
  return AnalysisDiff.deleteMany({ city });
};
