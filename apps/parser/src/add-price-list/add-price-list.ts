import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { api } from "@src/api/client";
import { env } from "@src/env";
import { ObjectId } from "mongodb";

import createData from "./helpers/create-data";
import isSameDay from "./helpers/is-same-day";

export async function addPriceList() {
  const path = resolve("src/pages");
  const html = readFileSync(join(path, "body.html")).toString();
  const { data } = JSON.parse(readFileSync(join(path, "prices.html")).toString());
  const goods = createData(html, data);
  const city = env.CITY;

  if (!city) throw new Error("No city found");

  if (goods.length > 0) {
    // Check if there's already a price list for today and delete it.
    // I want only one price list per day.
    const lastPriceList = await api.pricelist.getLast(city);

    if (
      lastPriceList &&
      isSameDay(new Date(lastPriceList.createdAt), new ObjectId().getTimestamp())
    ) {
      await api.service.deleteLastPriceList(city);
    }
    await api.service.savePriceList(city, goods);
  } else {
    throw new Error("No price list data to add.");
  }
}
