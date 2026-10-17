import type { Request } from "../request";
import type { PriceList, PriceListDate } from "@dns-markdown/types/pricelist";

export const createPriceListApi = (request: Request) => ({
  getLast: (city: string) => request.get<PriceList>("/api/pricelist", { city }),
  getDates: (city: string) => request.get<PriceListDate[]>("/api/pricelist/list", { city }),
  getById: (id: string) => request.get<PriceList>(`/api/pricelist/id/${id}`)
});
