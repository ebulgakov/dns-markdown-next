import getPerformance from "#helpers/get_performance.ts";
import { generateAnalysisReport } from "#ai/index.ts";
import { getLastPriceList } from "#api/get.ts";
import { addNewReportByCity, deleteReportByCityDate } from "#api/post.ts";

async function addReport() {
  const city = process.env.CITY || "samara";

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

  await deleteReportByCityDate({ city, dateAdded: lastPriceList.createdAt });

  const report = await generateAnalysisReport(JSON.stringify(priceListData));
  await addNewReportByCity({ city, report, dateAdded: lastPriceList.createdAt });
}

getPerformance(addReport).then(() => {
  console.log("/************** REPORT ADDED ****************/");
});
