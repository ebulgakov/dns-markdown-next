import { z } from "zod";

import type { RouteDoc } from "@src/openapi/types";

export const cityQuerySchema = z.object({
  city: z.string().trim().min(1)
});

export const linkQuerySchema = z.object({
  link: z.string().trim().min(1)
});

export const productsRouteDocs: RouteDoc[] = [
  {
    method: "get",
    path: "/api/products/link",
    summary: "Get a product's full history and status by its link",
    tags: ["Products"],
    security: ["clerkAndApiSecret"],
    query: linkQuerySchema
  },
  {
    method: "get",
    path: "/api/products/most-cheap-products",
    summary: "List products for a city sorted by price ascending",
    tags: ["Products"],
    security: ["clerkAndApiSecret"],
    query: cityQuerySchema
  },
  {
    method: "get",
    path: "/api/products/most-discounted-products",
    summary: "List products for a city sorted by discount",
    tags: ["Products"],
    security: ["clerkAndApiSecret"],
    query: cityQuerySchema
  },
  {
    method: "get",
    path: "/api/products/most-profitable-products",
    summary: "List products for a city sorted by profit",
    tags: ["Products"],
    security: ["clerkAndApiSecret"],
    query: cityQuerySchema
  }
];
