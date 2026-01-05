import * as cheerio from "cheerio";
import { dbConnect, dbDisconnect } from "../db/database.ts";
import getFile from "../helpers/get_file.ts";
import { joinPath } from "../helpers/get_dirname.ts";
import { type Goods } from "../types/pricelist.ts";
import createData from "./create_data.ts";

async function addPriceList() {
  const path = joinPath("../pages", import.meta.url);
  const html = getFile("body.html", path);
  const { data } = JSON.parse(getFile("prices.html", path));

  await dbConnect();

  const list = createData(html, data);
  await dbDisconnect();
}

addPriceList();
