import { Pricelist } from "#db/models/pricelist_model.js";

export const deleteLastPriceList = (city: string) => {
  return Pricelist.findOneAndDelete({ city }, { sort: { updatedAt: -1 } });
};
