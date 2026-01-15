
import { AnalysisData } from "#db/models/analysis_data_model.js";
import type { AnalysisData as AnalysisDataType } from "#types/analysis_data.js";

export const addManyAnalysisData = async (data: AnalysisDataType[]) => {
  return AnalysisData.insertMany(data);
};
