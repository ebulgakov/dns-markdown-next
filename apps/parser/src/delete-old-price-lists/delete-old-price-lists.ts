import { deleteOldPriceLists as deleteOldPriceListsCall } from "@src/api/post";
import { env } from "@src/env";

export async function deleteOldPriceLists() {
  const city = env.CITY;

  if (!city) throw new Error("No city found");

  await deleteOldPriceListsCall(city);
}
