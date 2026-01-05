import { Pricelist } from "../../models/pricelist_model.ts";

export const deleteLastPriceList = (city: string) => {
  return Pricelist.findOneAndDelete({ city }, { sort: { updatedAt: -1 } });
};
