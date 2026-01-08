import mongoose from "mongoose";
import Goods from "./goods-schema";

const schema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true
    },
    positions: [
      {
        title: String,
        items: [Goods]
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Pricelist = mongoose.models.Pricelist || mongoose.model("Pricelist", schema);
