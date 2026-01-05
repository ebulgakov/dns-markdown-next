import mongoose from "mongoose";
import type { History as HistoryType } from "../../types/history.js";

const schema = new mongoose.Schema({
  link: {
    type: String,
    require: true
  },
  city: String,
  labels: [String],
  priceOld: [String],
  price: [String],
  profit: [String]
});

export const History = mongoose.models.History || mongoose.model<HistoryType>("History", schema);
