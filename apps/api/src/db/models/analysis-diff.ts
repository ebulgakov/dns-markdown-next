import mongoose from "mongoose";

import analysisDiffSchema from "../schemas/analysis-diff";

import type { AnalysisDiff as AnalysisDiffType } from "@dns-markdown/types/analysis-diff";

export const AnalysisDiff =
  mongoose.models.AnalysisDiff ||
  mongoose.model<AnalysisDiffType>("AnalysisDiff", analysisDiffSchema);
