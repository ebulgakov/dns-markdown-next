import "dotenv/config";
import { ObjectId } from "mongodb";
import { dbConnect, dbDisconnect } from "#db/database.js";
import getFile from "./helpers/get_file.js";
import { joinPath } from "./helpers/get_dirname.js";
import createData from "./helpers/create_data.js";
import { savePriceList } from "#db/pricelist/mutations/save_price_list.js";
import { deleteLastPriceList } from "#db/pricelist/mutations/delete_last_price_list.js";
import { getLastPriceList } from "#db/pricelist/queries/get_last_price_list.js";
import isSameDay from "./helpers/is_same_day.js";
import getPerformance from "#helpers/get_performance.js";

async function addPriceList() {
  const path = joinPath("../pages", import.meta.url);
  const html = getFile("body.html", path) || "";
  const { data } = JSON.parse(getFile("prices.html", path)) || {};
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
