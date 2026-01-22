
import { AnalysisData } from "#db/models/analysis_data_model.ts";
import type { AnalysisData as AnalysisDataType } from "#types/analysis_data.ts";

export const addManyAnalysisData = async (data: AnalysisDataType[]) => {
  return AnalysisData.insertMany(data);
};
