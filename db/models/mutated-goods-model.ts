import mongoose from "mongoose";
import Goods from "./goods-schema";

const schema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true
    },
    goods: [Goods]
  },
  {
    timestamps: true
  }
);

export const RemovedGoods = mongoose.models.RemovedGoods || mongoose.model("RemovedGoods", schema);

export const NewGoods = mongoose.models.NewGoods || mongoose.model("NewGoods", schema);
