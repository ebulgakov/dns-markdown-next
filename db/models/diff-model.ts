import mongoose from "mongoose";

import Goods from "./goods-schema";

const goodsDiffSchema = new mongoose.Schema({
  item: Goods,
  diff: {
    priceOld: String,
    price: String,
    profit: String
  }
});
const diffSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true
    },
    changesPrice: [goodsDiffSchema],
    changesProfit: [goodsDiffSchema]
  },
  {
    timestamps: true
  }
);

export const Diff = mongoose.models.Diff || mongoose.model("Diff", diffSchema);
