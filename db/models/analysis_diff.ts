import mongoose from "mongoose";
import { AnalysisData } from "./analysis_data_model.js";

const analysisDiffSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  dateAdded: { type: Date, default: Date.now, index: true },
  newItems: [AnalysisData],
  removedItems: [AnalysisData],
  changesPrice: [
    {
      item: AnalysisData,
      diff: {
        priceOld: String,
        price: String,
        profit: String
      }
    }
  ],
  changesProfit: [
    {
      item: AnalysisData,
      diff: {
        priceOld: String,
        price: String,
        profit: String
      }
    }
  ]
});

export const AnalysisDiff =
  mongoose.models.AnalysisDiff || mongoose.model("AnalysisDiff", analysisDiffSchema);
