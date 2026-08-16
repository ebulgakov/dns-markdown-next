import {
  getMostCheapProducts,
  getMostDiscountedProducts,
  getMostProfitableProducts,
  getArchiveListDates
} from "@/entities/product";
import { getPriceListCity } from "@/entities/user";

import type { Goods } from "@/entities/product";
import type { CustomDate } from "@/types/common";

export async function getOffersData() {
  let catalogDate: CustomDate | undefined;
  let mostDiscounted: Goods | undefined;
  let mostProfitable: Goods | undefined;
  let mostCheap: Goods | undefined;
  let error: Error | undefined;
  let city: string | undefined;

  try {
    city = await getPriceListCity();
    const priceListDates = await getArchiveListDates(city);
    const mostCheapArr = await getMostCheapProducts(city);
    const mostDiscountedArr = await getMostDiscountedProducts(city);
    const mostProfitableArr = await getMostProfitableProducts(city);

    mostCheap = mostCheapArr[0];
    mostDiscounted = mostDiscountedArr[0];
    mostProfitable = mostProfitableArr[0];
    const [latestPriceList] = priceListDates.reverse();
    catalogDate = latestPriceList?.createdAt;
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
