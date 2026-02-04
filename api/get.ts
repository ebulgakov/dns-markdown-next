"use server";

import { unstable_cache } from "next/cache";

import { apiClient } from "@/api/client";

import { getUser } from "./post";

import type { AnalysisDiff, AnalysisDiffReport } from "@/types/analysis-diff";
import type { Goods, PriceList, PriceListDate, PriceListsArchiveCount } from "@/types/pricelist";
import type { ProductPayload } from "@/types/product";
import type { ReportsResponse } from "@/types/reports";

const wrapApiCall = async (endpoint: string, options = {}) => {
  try {
    const response = await apiClient.get(endpoint, options);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const getLastPriceList = async (city: string) =>
  unstable_cache(
    async (): Promise<PriceList> => wrapApiCall("/api/pricelist", { params: { city } }),
    ["last-pricelist", city],
    { tags: ["daily-data"] }
  )();

export const getArchiveListDates = async (city: string) =>
  unstable_cache(
    async (): Promise<PriceListDate[]> => wrapApiCall("/api/pricelist/list", { params: { city } }),
    ["archive-list-dates", city],
    { tags: ["daily-data"] }
  )();

export const getPriceListById = async (id: string) =>
  unstable_cache(
    async (): Promise<PriceList> => wrapApiCall(`/api/pricelist/id/${id}`),
    ["pricelist-by-id", id]
  )();

export const getPriceListCity = async (): Promise<string> => {
  const user = await getUser();
  return user?.city || process.env.DEFAULT_CITY!;
};

export const getProductByLink = async (link: string) =>
  unstable_cache(
    async (): Promise<ProductPayload> => wrapApiCall("/api/products/link", { params: { link } }),
    ["product-by-link", link],
    { tags: ["daily-data"] }
  )();

export const getMostCheapProducts = async (city: string) =>
  unstable_cache(
    async (): Promise<Goods[]> =>
      wrapApiCall("/api/products/most-cheap-products", { params: { city } }),
    ["most-cheap-products", city],
    { tags: ["daily-data"] }
  )();

export const getMostDiscountedProducts = async (city: string) =>
  unstable_cache(
    async (): Promise<Goods[]> =>
      wrapApiCall("/api/products/most-discounted-products", { params: { city } }),
    ["most-discounted-products", city],
    { tags: ["daily-data"] }
  )();

export const getMostProfitableProducts = async (city: string) =>
  unstable_cache(
    async (): Promise<Goods[]> =>
      wrapApiCall("/api/products/most-profitable-products", { params: { city } }),
    ["most-profitable-products", city],
    { tags: ["daily-data"] }
  )();

export const getLastDiffByCity = async (city: string) =>
  unstable_cache(
    async (): Promise<AnalysisDiff> => wrapApiCall("/api/analysis/last-diff", { params: { city } }),
    ["last-diff-by-city", city],
    { tags: ["daily-data"] }
  )();

export const getLast30DiffsReportByCity = async (city: string) =>
  unstable_cache(
    async (): Promise<AnalysisDiffReport[]> =>
      wrapApiCall("/api/analysis/all-diffs", { params: { city } }),
    ["last-30-diffs-report-by-city", city],
    { tags: ["daily-data"] }
  )();

export const getLast30ArchiveProductsCount = async (city: string) =>
  unstable_cache(
    async (): Promise<PriceListsArchiveCount[]> =>
      wrapApiCall("/api/analysis/products-count", { params: { city } }),
    ["last-30-archive-products-count", city],
    { tags: ["daily-data"] }
  )();

export const getLast30ReportsByCity = async (city: string) =>
  unstable_cache(
    async (): Promise<ReportsResponse> =>
      wrapApiCall("/api/analysis/reports", { params: { city } }),
    ["last-30-reports-by-city", city],
    { tags: ["daily-data"] }
  )();

export const getTotalUniqProductsCount = async (city: string) =>
  unstable_cache(
    async (): Promise<number> =>
      wrapApiCall("/api/analysis/total-uniq-products-count", { params: { city } }),
    ["total-uniq-products-count", city],
    { tags: ["daily-data"] }
  )();
