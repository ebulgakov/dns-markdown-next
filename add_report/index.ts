import { dbConnect, dbDisconnect } from "#db/database.js";
import getPerformance from "#helpers/get_performance.js";
import { getLastPriceList } from "#db/pricelist/queries/get_last_price_list.js";
import { addNewReportByCity } from "#db/reports/mutations/add_new_report_by_city.js";
import { removeReportByCityDate } from "#db/reports/mutations/remove_report_by_city_date.js";
import { generateAnalysisReport } from "#ai/index.js";

async function addReport() {
  const city = process.env.CITY || "samara";

  await dbConnect();

  const lastPriceList = await getLastPriceList(city);

  if (!lastPriceList) throw new Error("No price list found for city");

  await removeReportByCityDate({ city, dateAdded: lastPriceList.createdAt });

  const report = await generateAnalysisReport(JSON.stringify(lastPriceList));
  await addNewReportByCity({ city, report, dateAdded: lastPriceList.createdAt });

  await dbDisconnect();
}

getPerformance(addReport).then(() => {
  console.log("/************** REPORT ADDED ****************/");
});
