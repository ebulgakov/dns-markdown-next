import "dotenv/config";
import { dbConnect, dbDisconnect } from "../db/database.ts";
import getFile from "../helpers/get_file.ts";
import { joinPath } from "../helpers/get_dirname.ts";
import createData from "./create_data.ts";
import { savePriceList } from "../db/pricelist/mutations/save_price_list.ts";

async function addPriceList() {
  const path = joinPath("../pages", import.meta.url);
  const html = getFile("body.html", path);
  const { data } = JSON.parse(getFile("prices.html", path));

  await dbConnect();

  const city = process.env.CITY;
  const json = createData(html, data);
  await savePriceList(city, json);

  await dbDisconnect();
}

addPriceList().then(() => {
  console.log("/************** PRICE LIST ADDED ****************/");
});
