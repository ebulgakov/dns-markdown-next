"use server";

import { unstable_cache as cacheToken } from "next/cache";

import { apiClient } from "@/api/client";

import { getUser } from "./user";

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

const getCachedPriceList = cacheToken(
  async (city: string): Promise<PriceList | null> => {
    return wrapApiCall("/api/pricelist", { params: { city } });
  },
  ["last-pricelist"],
  { tags: ["daily-data"] }
);
export const getLastPriceList = async (city: string) => getCachedPriceList(city);

const getCachedArchiveListDates = cacheToken(
  async (city: string): Promise<PriceListDate[]> =>
    wrapApiCall("/api/pricelist/list", { params: { city } }),
  ["archive-list-dates"],
  { tags: ["daily-data"] }
);
export const getArchiveListDates = async (city: string) => getCachedArchiveListDates(city);

const getCachedPriceListById = cacheToken(
  async (id: string): Promise<PriceList> => wrapApiCall(`/api/pricelist/id/${id}`),
  ["pricelist-by-id"],
  { tags: ["daily-data"] }
);
export const getPriceListById = async (id: string) => getCachedPriceListById(id);

export const getPriceListCity = async (): Promise<string> => {
  const user = await getUser();
  return user?.city || process.env.DEFAULT_CITY!;
};

const getCachedProductByLink = cacheToken(
  async (link: string): Promise<ProductPayload> =>
    wrapApiCall("/api/products/link", { params: { link } }),
  ["product-by-link"],
  { tags: ["daily-data"] }
);
export const getProductByLink = async (link: string) => getCachedProductByLink(link);

const getCachedMostCheapProducts = cacheToken(
  async (city: string): Promise<Goods[]> =>
    wrapApiCall("/api/products/most-cheap-products", { params: { city } }),
  ["most-cheap-products"],
  { tags: ["daily-data"] }
);
export const getMostCheapProducts = async (city: string) => getCachedMostCheapProducts(city);

const getCachedMostDiscountedProducts = cacheToken(
  async (city: string): Promise<Goods[]> =>
    wrapApiCall("/api/products/most-discounted-products", { params: { city } }),
  ["most-discounted-products"],
  { tags: ["daily-data"] }
);
export const getMostDiscountedProducts = async (city: string) =>
  getCachedMostDiscountedProducts(city);

const getCachedMostProfitableProducts = cacheToken(
  async (city: string): Promise<Goods[]> =>
    wrapApiCall("/api/products/most-profitable-products", { params: { city } }),
  ["most-profitable-products"],
  { tags: ["daily-data"] }
);
export const getMostProfitableProducts = async (city: string) =>
  getCachedMostProfitableProducts(city);

const getCachedLastDiffByCity = cacheToken(
  async (city: string): Promise<AnalysisDiff> =>
    wrapApiCall("/api/analysis/last-diff", { params: { city } }),
  ["last-diff-by-city"],
  { tags: ["daily-data"] }
);
export const getLastDiffByCity = async (city: string) => getCachedLastDiffByCity(city);

const getCachedLast30DiffsReportByCity = cacheToken(
  async (city: string): Promise<AnalysisDiffReport[]> =>
    wrapApiCall("/api/analysis/all-diffs", { params: { city } }),
  ["last-30-diffs-report-by-city"],
  { tags: ["daily-data"] }
);
export const getLast30DiffsReportByCity = async (city: string) =>
  getCachedLast30DiffsReportByCity(city);

export const getCachedLast30ArchiveProductsCount = cacheToken(
  async (city: string): Promise<PriceListsArchiveCount[]> =>
    wrapApiCall("/api/analysis/products-count", { params: { city } }),
  ["last-30-archive-products-count"],
  { tags: ["daily-data"] }
);
export const getLast30ArchiveProductsCount = async (city: string) =>
  getCachedLast30ArchiveProductsCount(city);

const getCachedLast30ReportsByCity = cacheToken(
  async (city: string): Promise<ReportsResponse> =>
    wrapApiCall("/api/analysis/reports", { params: { city } }),
  ["last-30-reports-by-city"],
  { tags: ["daily-data"] }
);
export const getLast30ReportsByCity = async (city: string) => getCachedLast30ReportsByCity(city);

const getCachedTotalUniqProductsCount = cacheToken(
  async (city: string): Promise<number> =>
    wrapApiCall("/api/analysis/total-uniq-products-count", { params: { city } }),
  ["total-uniq-products-count"],
  { tags: ["daily-data"] }
);
export const getTotalUniqProductsCount = async (city: string) =>
  getCachedTotalUniqProductsCount(city);
