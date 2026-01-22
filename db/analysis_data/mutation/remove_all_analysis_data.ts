import { AnalysisData } from "#db/models/analysis_data_model.ts";

export const removeAllAnalysisData = (city: string) => {
  return AnalysisData.deleteMany({ city });
}
