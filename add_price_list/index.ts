import "dotenv/config";
import { ObjectId } from "mongodb";
import { dbConnect, dbDisconnect } from "../db/database.ts";
import getFile from "./helpers/get_file.ts";
import { joinPath } from "./helpers/get_dirname.ts";
import createData from "./helpers/create_data.ts";
import { savePriceList } from "../db/pricelist/mutations/save_price_list.ts";
import { deleteLastPriceList } from "../db/pricelist/mutations/delete_last_price_list.ts";
import { getLastPriceList } from "../db/pricelist/queries/get_last_price_list.ts";
import isSameDay from "./helpers/is_same_day.ts";

async function addPriceList() {
  const path = joinPath("../pages", import.meta.url);
  const html = getFile("body.html", path);
  const { data } = JSON.parse(getFile("prices.html", path));
  const json = createData(html, data);
  const city = process.env.CITY;

  await dbConnect();

  // Check if there's already a price list for today and delete it.
  // I want only one price list per day.
  const lastPriceList = await getLastPriceList(city);
  if (lastPriceList && isSameDay(new Date(lastPriceList.createdAt), new ObjectId().getTimestamp())) {
    await deleteLastPriceList(city);
  }

  await savePriceList(city, json);
  await dbDisconnect();
}

addPriceList().then(() => {
  console.log("/************** PRICE LIST ADDED ****************/");
});
