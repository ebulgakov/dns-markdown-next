import mongoose from "mongoose";

import priceListSchema from "../schemas/pricelist";

import type { PriceList } from "../types/pricelist";

export const Pricelist =
  mongoose.models.Pricelist || mongoose.model<PriceList>("Pricelist", priceListSchema);
