import redis from "#cache/index.ts";
import { dbConnect, dbDisconnect } from "#db/database.ts";
import getPerformance from "#helpers/get_performance.ts";
import { getLastPriceList } from "#db/pricelist/queries/get_last_price_list.ts";
import { addNewReportByCity } from "#db/reports/mutations/add_new_report_by_city.ts";
import { removeReportByCityDate } from "#db/reports/mutations/remove_report_by_city_date.ts";
import { generateAnalysisReport } from "#ai/index.ts";

async function addReport() {
  const city = process.env.CITY || "samara";

  await dbConnect();

  const lastPriceList = await getLastPriceList(city);

  if (!lastPriceList) throw new Error("No price list found for city");

  let priceListData = JSON.parse(JSON.stringify(lastPriceList)) as any;

  priceListData = priceListData.positions.flatMap((position: any) =>
    position.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      price: item.price,
      priceOld: item.priceOld || "-",
      profit: item.profit || "-",
      defects: item.reasons.map((reason: any) => `${reason.label}: ${reason.text}`).join("; ")
    }))
  );

  await removeReportByCityDate({ city, dateAdded: lastPriceList.createdAt });

  const report = await generateAnalysisReport(JSON.stringify(priceListData));
  await addNewReportByCity({ city, report, dateAdded: lastPriceList.createdAt });

  const key = `analytics-reports:all:${String(city)}-${priceListData.createdAt}`;
  await redis.del(key);

  await dbDisconnect();
}

getPerformance(addReport).then(() => {
  console.log("/************** REPORT ADDED ****************/");
});
