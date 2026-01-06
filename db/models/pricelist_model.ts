import mongoose, { Model } from "mongoose";
import Goods from "./goods_schema.ts";
import { type PriceList as PriceListType } from "../../types/pricelist.ts";

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
