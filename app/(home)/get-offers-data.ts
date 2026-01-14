import {
  getMostProfitableGoods,
  getMostCheapGoods,
  getMostDiscountedGoods,
  getPriceListCity,
  getLastPriceList
} from "@/db/pricelist/queries";

import type { Goods } from "@/types/pricelist";

export async function getOffersData() {
  let catalogDate: Date | string = new Date();
  let mostDiscounted: Goods | undefined;
  let mostProfitable: Goods | undefined;
  let mostCheap: Goods | undefined;
  let error: Error | undefined;

  try {
    const city = await getPriceListCity();
    const priceList = await getLastPriceList(city);
    const mostCheapArr = await getMostCheapGoods(city);
    const mostDiscountedArr = await getMostDiscountedGoods(city);
    const mostProfitableArr = await getMostProfitableGoods(city);

    mostCheap = mostCheapArr[0] || null;
    mostDiscounted = mostDiscountedArr[0] || null;
    mostProfitable = mostProfitableArr[0] || null;
    catalogDate = priceList.createdAt;
  } catch (e) {
    error = e as Error;
  }

  return {
    catalogDate,
    mostDiscounted,
    mostProfitable,
    mostCheap,
    error
  };
}
