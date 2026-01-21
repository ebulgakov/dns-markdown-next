import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  dateAdded: { type: Date, default: Date.now, index: true },
  report: { type: String, required: true }
});

export const Reports = mongoose.models.Reports || mongoose.model("Reports", reportsSchema);
