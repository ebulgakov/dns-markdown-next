import { AnalysisDiff } from "#db/models/analysis_diff.js";

export const removeAnalysisByDateDiff = (date: string, city: string) => {
  return AnalysisDiff.deleteMany({ dateAdded: date, city });
};
