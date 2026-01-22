import { AnalysisDiff } from "#db/models/analysis_diff_model.ts";

export const removeAnalysisByDateDiff = (date: string, city: string) => {
  return AnalysisDiff.deleteMany({ dateAdded: date, city });
};
