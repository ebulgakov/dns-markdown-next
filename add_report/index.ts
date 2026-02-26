import getPerformance from "#helpers/get_performance.ts";
import { getLastPriceList } from "#api/get.ts";
import { addNewReportByCity, deleteReportByCityDate } from "#api/post.ts";

async function addReport() {
  const city = process.env.CITY;

  if (!city) throw new Error("No city found");

  const lastPriceList = await getLastPriceList(city);

  if (!lastPriceList) throw new Error("No price list found for city");

  await deleteReportByCityDate({ city, dateAdded: lastPriceList.createdAt });

  await addNewReportByCity({ city });
}

getPerformance(addReport)
  .then(() => {
    console.log("/************** REPORT ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding report:", err);
  });
