import mongoose from "mongoose";

import analysisDataSchema from "../schemas/analysis-data";

import type { AnalysisData as AnalysisDataType } from "../types/analysis-data";

export const AnalysisData =
  mongoose.models.AnalysisData ||
  mongoose.model<AnalysisDataType>("AnalysisData", analysisDataSchema);
