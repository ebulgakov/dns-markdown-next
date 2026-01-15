import { AnalysisData } from "#db/models/analysis_data_model.js";

export const removeAnalysisByDateData = (date: string, city: string) => {
  return AnalysisData.deleteMany({ dateAdded: date, city });
};
