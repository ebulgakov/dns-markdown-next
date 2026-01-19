import {
  getMostProfitableGoods,
  getMostCheapGoods,
  getMostDiscountedGoods,
  getPriceListCity,
  getLastPriceList,
  getLastPriceListDate
} from "@/db/pricelist/queries";

import type { CustomDate } from "@/types/common";
import type { Goods } from "@/types/pricelist";

export async function getOffersData() {
  let catalogDate: CustomDate | undefined;
  let mostDiscounted: Goods | undefined;
  let mostProfitable: Goods | undefined;
  let mostCheap: Goods | undefined;
  let error: Error | undefined;
  let city: string | undefined;

  try {
    city = await getPriceListCity();
    const priceList = await getLastPriceList(city);
    const lastPriceListDate = await getLastPriceListDate(city);
    const mostCheapArr = await getMostCheapGoods(city, lastPriceListDate);
    const mostDiscountedArr = await getMostDiscountedGoods(city, lastPriceListDate);
    const mostProfitableArr = await getMostProfitableGoods(city, lastPriceListDate);

    mostCheap = mostCheapArr[0];
    mostDiscounted = mostDiscountedArr[0];
    mostProfitable = mostProfitableArr[0];
    catalogDate = priceList.createdAt;
  } catch (e) {
    error = e as Error;
  }

  return {
    catalogDate,
    mostDiscounted,
    mostProfitable,
    mostCheap,
    city,
    error
  };
}
