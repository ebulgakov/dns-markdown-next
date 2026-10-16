import { deleteOldPriceLists as deleteOldPriceListsCall } from "#api/post.ts";
import { env } from "#env.ts";
import getPerformance from "#helpers/get_performance.ts";

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
