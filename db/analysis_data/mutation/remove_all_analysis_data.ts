import { AnalysisData } from "#db/models/analysis_data_model.js";

export const removeAllAnalysisData = (city: string) => {
  return AnalysisData.deleteMany({ city });
}
