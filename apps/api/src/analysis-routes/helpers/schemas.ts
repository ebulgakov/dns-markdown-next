import { z } from "zod";

import type { RouteDoc } from "@src/openapi/types";

export const cityQuerySchema = z.object({
  city: z.string().trim().min(1)
});

export const cityDateQuerySchema = z.object({
  city: z.string().trim().min(1),
  dateAdded: z.union([z.iso.date(), z.iso.datetime()], {
    error: "must be a valid ISO date (YYYY-MM-DD) or datetime string"
  })
});

export const analysisRouteDocs: RouteDoc[] = [
  {
    method: "get",
    path: "/api/analysis/last-diff",
    summary: "Get the most recent analysis diff for a city",
    tags: ["Analysis"],
    security: ["clerkAndApiSecret"],
    query: cityQuerySchema
  },
  {
    method: "get",
    path: "/api/analysis/reports",
    summary: "List LLM analysis reports for a city",
    tags: ["Analysis"],
    security: ["clerkAndApiSecret"],
    query: cityQuerySchema
  },
  {
    method: "get",
    path: "/api/analysis/all-diffs",
    summary: "List analysis diff summaries for a city",
    tags: ["Analysis"],
    security: ["clerkAndApiSecret"],
    query: cityQuerySchema
  },
  {
    method: "get",
    path: "/api/analysis/all-analysis-goods-by-date-added",
    summary: "List analysis goods for a city on a given date",
    tags: ["Analysis"],
    security: ["clerkAndApiSecret"],
    query: cityDateQuerySchema
  },
  {
    method: "get",
    path: "/api/analysis/products-count",
    summary: "Get product counts per archived price list date for a city",
    tags: ["Analysis"],
    security: ["clerkAndApiSecret"],
    query: cityQuerySchema
  },
  {
    method: "get",
    path: "/api/analysis/total-uniq-products-count",
    summary: "Get the total count of unique products ever seen for a city",
    tags: ["Analysis"],
    security: ["clerkAndApiSecret"],
    query: cityQuerySchema
  }
];
