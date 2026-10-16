import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  dateAdded: { type: Date, default: Date.now, index: true },
  report: { type: String, required: true }
});

reportsSchema.index({ city: 1, dateAdded: 1 }, { unique: true });

export default reportsSchema;
