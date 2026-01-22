import "dotenv/config";
import { ObjectId } from "mongodb";
import { dbConnect, dbDisconnect } from "#db/database.ts";
import createData from "./helpers/create_data.ts";
import { savePriceList } from "#db/pricelist/mutations/save_price_list.ts";
import { deleteLastPriceList } from "#db/pricelist/mutations/delete_last_price_list.ts";
import { getLastPriceList } from "#db/pricelist/queries/get_last_price_list.ts";
import isSameDay from "./helpers/is_same_day.ts";
import getPerformance from "#helpers/get_performance.ts";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

async function addPriceList() {
  const path = resolve('pages');
  const html = readFileSync(join(path, "body.html")).toString();
  const { data } = JSON.parse(readFileSync(join(path, "prices.html")).toString());
  const goods = createData(html, data);
  const city = process.env.CITY || "samara";

  if (goods.length > 0) {
    await dbConnect();

    // Check if there's already a price list for today and delete it.
    // I want only one price list per day.
    const lastPriceList = await getLastPriceList(city);
    if (
      lastPriceList &&
      isSameDay(new Date(lastPriceList.createdAt), new ObjectId().getTimestamp())
    ) {
      await deleteLastPriceList(city);
    }

    await savePriceList(city, goods);

    await dbDisconnect();
  } else {
    throw new Error("No price list data to add.");
  }
}

getPerformance(addPriceList).then(() => {
  console.log("/************** PRICE LIST ADDED ****************/");
});
