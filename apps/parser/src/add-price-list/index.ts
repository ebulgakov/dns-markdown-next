import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { getLastPriceList } from "@src/api/get";
import { deleteLastPriceList, savePriceList } from "@src/api/post";
import { env } from "@src/env";
import getPerformance from "@src/helpers/get-performance";
import { ObjectId } from "mongodb";

import createData from "./helpers/create-data";
import isSameDay from "./helpers/is-same-day";

async function addPriceList() {
  const path = resolve("pages");
  const html = readFileSync(join(path, "body.html")).toString();
  const { data } = JSON.parse(readFileSync(join(path, "prices.html")).toString());
  const goods = createData(html, data);
  const city = env.CITY;

  if (!city) throw new Error("No city found");

  if (goods.length > 0) {
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
  } else {
    throw new Error("No price list data to add.");
  }
}

getPerformance(addPriceList)
  .then(() => {
    console.log("/************** PRICE LIST ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding price list:", err);
    process.exit(1);
  });
