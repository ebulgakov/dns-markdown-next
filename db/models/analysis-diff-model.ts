import mongoose from "mongoose";

import { analysisDataSchema } from "./analysis-data-model";

const analysisDiffSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  dateAdded: { type: Date, default: Date.now, index: true },
  newItems: [analysisDataSchema],
  removedItems: [analysisDataSchema],
  changesPrice: [
    {
      item: analysisDataSchema,
      diff: {
        priceOld: String,
        price: String,
        profit: String
      }
    }
  ],
  changesProfit: [
    {
      item: analysisDataSchema,
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
