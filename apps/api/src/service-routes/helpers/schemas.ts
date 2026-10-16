import { z } from "zod";

import type { RouteDoc } from "@src/openapi/types";

const dateStringSchema = z.union([z.iso.date(), z.iso.datetime()], {
  error: "must be a valid ISO date (YYYY-MM-DD) or datetime string"
});

const reasonSchema = z.object({
  _id: z.string(),
  label: z.string(),
  text: z.string()
});

const goodsSchema = z.object({
  _id: z.string(),
  title: z.string(),
  link: z.string(),
  description: z.string(),
  reasons: z.array(reasonSchema),
  priceOld: z.string(),
  price: z.string(),
  profit: z.string(),
  code: z.string(),
  image: z.string(),
  available: z.string(),
  dateAdded: z.string().nullable().optional()
});

const positionSchema = z.object({
  _id: z.string(),
  title: z.string(),
  items: z.array(goodsSchema)
});

const analysisDataItemSchema = goodsSchema.extend({
  city: z.string(),
  category: z.string(),
  dateAdded: z.string()
});

const diffSchema = z.object({
  priceOld: z.string(),
  price: z.string(),
  profit: z.string()
});

const diffDetailSchema = z.object({
  item: analysisDataItemSchema,
  diff: diffSchema
});

const analysisDiffItemSchema = z.object({
  city: z.string(),
  dateAdded: z.string(),
  newItems: z.array(analysisDataItemSchema),
  removedItems: z.array(analysisDataItemSchema),
  changesPrice: z.array(diffDetailSchema),
  changesProfit: z.array(diffDetailSchema)
});

const favoriteStatusSchema = z.object({
  updatedAt: z.string(),
  createdAt: z.string(),
  deleted: z.boolean(),
  city: z.string()
});

const favoriteSchema = z.object({
  _id: z.string(),
  status: favoriteStatusSchema,
  item: goodsSchema
});

export const citySchema = z.object({
  city: z.string().trim().min(1)
});

export const cityDateSchema = z.object({
  city: z.string().trim().min(1),
  dateAdded: dateStringSchema
});

export const addNewPriceListBodySchema = z.object({
  city: z.string().trim().min(1),
  positions: z.array(positionSchema).min(1)
});

export const insertAnalysisDataBodySchema = z.object({
  analysisData: z.array(analysisDataItemSchema).min(1)
});

export const insertAnalysisDiffBodySchema = z.object({
  diff: z.array(analysisDiffItemSchema).min(1)
});

export const updateUsersFavoritesBodySchema = z.object({
  users: z.array(
    z.object({
      userId: z.string().trim().min(1),
      favorites: z.array(favoriteSchema)
    })
  )
});

export const clearCacheByKeyBodySchema = z.object({
  keys: z.string().trim().min(1)
});

export const allPriceListsQuerySchema = z.object({
  city: z.string().trim().min(1),
  limit: z.coerce.number().int().positive().optional()
});

export const serviceRouteDocs: RouteDoc[] = [
  {
    method: "get",
    path: "/service/all-price-lists",
    summary: "List all price lists for a city",
    tags: ["Service / Pricelist"],
    security: ["serviceBearer"],
    query: allPriceListsQuerySchema
  },
  {
    method: "post",
    path: "/service/delete-last-price-list",
    summary: "Delete the most recent price list for a city",
    tags: ["Service / Pricelist"],
    security: ["serviceBearer"],
    body: citySchema
  },
  {
    method: "post",
    path: "/service/delete-old-price-lists",
    summary: "Delete all price lists for a city except the 30 most recent",
    tags: ["Service / Pricelist"],
    security: ["serviceBearer"],
    body: citySchema
  },
  {
    method: "post",
    path: "/service/add-new-price-list",
    summary: "Insert a new price list",
    tags: ["Service / Pricelist"],
    security: ["serviceBearer"],
    body: addNewPriceListBodySchema
  },
  {
    method: "post",
    path: "/service/insert-analysis-data",
    summary: "Bulk insert analysis data",
    tags: ["Service / Analysis"],
    security: ["serviceBearer"],
    body: insertAnalysisDataBodySchema
  },
  {
    method: "post",
    path: "/service/delete-analysis-data",
    summary: "Delete all analysis data for a city",
    tags: ["Service / Analysis"],
    security: ["serviceBearer"],
    body: citySchema
  },
  {
    method: "post",
    path: "/service/delete-analysis-data-by-date",
    summary: "Delete analysis data for a city on a given date",
    tags: ["Service / Analysis"],
    security: ["serviceBearer"],
    body: cityDateSchema
  },
  {
    method: "post",
    path: "/service/insert-analysis-diff",
    summary: "Bulk insert analysis diffs",
    tags: ["Service / Analysis"],
    security: ["serviceBearer"],
    body: insertAnalysisDiffBodySchema
  },
  {
    method: "post",
    path: "/service/delete-analysis-diff",
    summary: "Delete all analysis diffs for a city",
    tags: ["Service / Analysis"],
    security: ["serviceBearer"],
    body: citySchema
  },
  {
    method: "post",
    path: "/service/delete-analysis-diff-by-date",
    summary: "Delete analysis diffs for a city on a given date",
    tags: ["Service / Analysis"],
    security: ["serviceBearer"],
    body: cityDateSchema
  },
  {
    method: "post",
    path: "/service/add-analysis-report",
    summary: "Generate and store an LLM analysis report for a city",
    tags: ["Service / Analysis"],
    security: ["serviceBearer"],
    body: citySchema
  },
  {
    method: "post",
    path: "/service/delete-analysis-report-by-city-date",
    summary: "Delete an analysis report for a city on a given date",
    tags: ["Service / Analysis"],
    security: ["serviceBearer"],
    body: cityDateSchema
  },
  {
    method: "get",
    path: "/service/all-notification-users",
    summary: "List users subscribed to update notifications for a city",
    tags: ["Service / Users"],
    security: ["serviceBearer"],
    query: citySchema
  },
  {
    method: "post",
    path: "/service/update-users-favorites",
    summary: "Bulk overwrite favorites for a set of users",
    tags: ["Service / Users"],
    security: ["serviceBearer"],
    body: updateUsersFavoritesBodySchema
  },
  {
    method: "post",
    path: "/service/clear-cache-by-key",
    summary: "Invalidate cache entries matching a glob pattern",
    tags: ["Service / Cache"],
    security: ["serviceBearer"],
    body: clearCacheByKeyBodySchema
  }
];
