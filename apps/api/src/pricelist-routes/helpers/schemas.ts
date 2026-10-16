import { z } from "zod";

import type { RouteDoc } from "@src/openapi/types";

export const lastPriceListQuerySchema = z.object({
  city: z.string().trim().min(1)
});

export const listPriceListsQuerySchema = z.object({
  city: z.string().trim().min(1)
});

export const priceListByIdParamsSchema = z.object({
  id: z.string().trim().min(1)
});

export const pricelistRouteDocs: RouteDoc[] = [
  {
    method: "get",
    path: "/api/pricelist",
    summary: "Get the latest price list for a city",
    tags: ["Pricelist"],
    security: ["clerkAndApiSecret"],
    query: lastPriceListQuerySchema
  },
  {
    method: "get",
    path: "/api/pricelist/list",
    summary: "List archived price list dates for a city",
    tags: ["Pricelist"],
    security: ["clerkAndApiSecret"],
    query: listPriceListsQuerySchema
  },
  {
    method: "get",
    path: "/api/pricelist/id/{id}",
    summary: "Get an archived price list by id",
    tags: ["Pricelist"],
    security: ["clerkAndApiSecret"],
    params: priceListByIdParamsSchema
  }
];
