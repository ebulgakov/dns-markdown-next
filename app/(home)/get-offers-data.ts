import {
  getMostCheapProducts,
  getMostDiscountedProducts,
  getMostProfitableProducts,
  getArchiveListDates,
  getPriceListCity
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
    const priceListDates = await getArchiveListDates();
    const mostCheapArr = await getMostCheapProducts();
    const mostDiscountedArr = await getMostDiscountedProducts();
    const mostProfitableArr = await getMostProfitableProducts();

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
