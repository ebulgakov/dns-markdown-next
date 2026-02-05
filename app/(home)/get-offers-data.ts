import {
  getLastPriceList,
  getPriceListCity,
  getMostCheapProducts,
  getMostDiscountedProducts,
  getMostProfitableProducts
} from "@/api/get";

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
    const mostCheapArr = await getMostCheapProducts(city);
    const mostDiscountedArr = await getMostDiscountedProducts(city);
    const mostProfitableArr = await getMostProfitableProducts(city);

    mostCheap = mostCheapArr[0];
    mostDiscounted = mostDiscountedArr[0];
    mostProfitable = mostProfitableArr[0];
    catalogDate = priceList?.createdAt;
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
