import mongoose from "mongoose";
import Goods from "./goods_schema";

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

export const HourlyPricelist =
  mongoose.models.Hourly_pricelist || mongoose.model("Hourly_pricelist", schema);

export const Pricelist = mongoose.models.Pricelist || mongoose.model("Pricelist", schema);
