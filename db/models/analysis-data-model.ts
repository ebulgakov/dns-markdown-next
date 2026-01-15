import mongoose from "mongoose";

import Goods from "./goods-schema";

const analysisDataSchema = Goods.clone();

analysisDataSchema.add({
  city: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  dateAdded: { type: Date, default: Date.now, index: true }
});

export const AnalysisData =
  mongoose.models.AnalysisData || mongoose.model("AnalysisData", analysisDataSchema);
