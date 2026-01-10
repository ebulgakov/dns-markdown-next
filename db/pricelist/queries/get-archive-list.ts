import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";
import { getUser } from "@/db/user/queries";

import type { PriceList as PriceListType } from "@/types/pricelist";

export const getArchiveList = async () => {
  await dbConnect();
  const user = await getUser();

  if (!user) throw new Error("User not found");

  return Pricelist.find({ city: user.city }, {}, { sort: { updatedAt: 1 } }).select(
    "createdAt"
  ) as unknown as PriceListType[];
};
