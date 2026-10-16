import { deleteOldPriceLists as deleteOldPriceListsCall } from "@src/api/post";
import { env } from "@src/env";
import getPerformance from "@src/helpers/get-performance";

async function deleteOldPriceLists() {
  const city = env.CITY;

  if (!city) throw new Error("No city found");

  await deleteOldPriceListsCall(city);
}

getPerformance(deleteOldPriceLists)
  .then(() => {
    console.log("/************** OLD PRICELISTS DELETED ****************/");
  })
  .catch(err => {
    console.error("Error deleting old price lists:", err);
    process.exit(1);
  });
