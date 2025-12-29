import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist_model";
import type { PriceList as PriceListType } from "@/types/pricelist";

export const getPriceListById = async (id: string) => {
  await dbConnect();
  return Pricelist.findOne({ id: id }) as unknown as PriceListType | null;
};
