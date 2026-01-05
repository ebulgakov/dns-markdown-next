import mongoose from "mongoose";

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

export const History = mongoose.models.History || mongoose.model("History", schema);
