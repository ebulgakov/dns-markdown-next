import type { Request } from "../request";
import type { Goods } from "@dns-markdown/types/pricelist";
import type { ProductPayload } from "@dns-markdown/types/product";

export const createProductsApi = (request: Request) => ({
  getByLink: (link: string) => request.get<ProductPayload>("/api/products/link", { link }),
  getMostCheap: (city: string) =>
    request.get<Goods[]>("/api/products/most-cheap-products", { city }),
  getMostDiscounted: (city: string) =>
    request.get<Goods[]>("/api/products/most-discounted-products", { city }),
  getMostProfitable: (city: string) =>
    request.get<Goods[]>("/api/products/most-profitable-products", { city })
});
