import mongoose, { type Model } from "mongoose";
import Goods from "./goods_schema.js";
import type {  PriceList as PriceListType } from "#types/pricelist.js";

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

export const Pricelist: Model<PriceListType> =
  mongoose.models.Pricelist || mongoose.model<PriceListType>("Pricelist", schema);
