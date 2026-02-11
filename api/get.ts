"use server";

import { unstable_cache as cacheToken } from "next/cache";

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

const getCachedPriceList = cacheToken(
  async (city: string): Promise<PriceList | null> => {
    return wrapApiCall("/api/pricelist", { params: { city } });
  },
  ["last-pricelist"],
  { tags: ["daily-data"] }
);
export const getLastPriceList = async (city?: string) => {
  const defaultCity = await getPriceListCity();
  const cityToUse = city || defaultCity;
  return getCachedPriceList(cityToUse);
};

const getCachedArchiveListDates = cacheToken(
  async (city: string): Promise<PriceListDate[]> =>
    wrapApiCall("/api/pricelist/list", { params: { city } }),
  ["archive-list-dates"],
  { tags: ["daily-data"] }
);
export const getArchiveListDates = async () => {
  const defaultCity = await getPriceListCity();
  return getCachedArchiveListDates(defaultCity);
};

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
export const getMostCheapProducts = async () => {
  const defaultCity = await getPriceListCity();
  return getCachedMostCheapProducts(defaultCity);
};

const getCachedMostDiscountedProducts = cacheToken(
  async (city: string): Promise<Goods[]> =>
    wrapApiCall("/api/products/most-discounted-products", { params: { city } }),
  ["most-discounted-products"],
  { tags: ["daily-data"] }
);
export const getMostDiscountedProducts = async () => {
  const defaultCity = await getPriceListCity();
  return getCachedMostDiscountedProducts(defaultCity);
};

const getCachedMostProfitableProducts = cacheToken(
  async (city: string): Promise<Goods[]> =>
    wrapApiCall("/api/products/most-profitable-products", { params: { city } }),
  ["most-profitable-products"],
  { tags: ["daily-data"] }
);
export const getMostProfitableProducts = async () => {
  const defaultCity = await getPriceListCity();
  return getCachedMostProfitableProducts(defaultCity);
};

const getCachedLastDiffByCity = cacheToken(
  async (city: string): Promise<AnalysisDiff> =>
    wrapApiCall("/api/analysis/last-diff", { params: { city } }),
  ["last-diff-by-city"],
  { tags: ["daily-data"] }
);
export const getLastDiffByCity = async () => {
  const defaultCity = await getPriceListCity();
  return getCachedLastDiffByCity(defaultCity);
};

const getCachedLast30DiffsReportByCity = cacheToken(
  async (city: string): Promise<AnalysisDiffReport[]> =>
    wrapApiCall("/api/analysis/all-diffs", { params: { city } }),
  ["last-30-diffs-report-by-city"],
  { tags: ["daily-data"] }
);
export const getLast30DiffsReportByCity = async () => {
  const defaultCity = await getPriceListCity();
  return getCachedLast30DiffsReportByCity(defaultCity);
};

const getCachedLast30ArchiveProductsCount = cacheToken(
  async (city: string): Promise<PriceListsArchiveCount[]> =>
    wrapApiCall("/api/analysis/products-count", { params: { city } }),
  ["last-30-archive-products-count"],
  { tags: ["daily-data"] }
);
export const getLast30ArchiveProductsCount = async () => {
  const defaultCity = await getPriceListCity();
  return getCachedLast30ArchiveProductsCount(defaultCity);
};

const getCachedLast30ReportsByCity = cacheToken(
  async (city: string): Promise<ReportsResponse> =>
    wrapApiCall("/api/analysis/reports", { params: { city } }),
  ["last-30-reports-by-city"],
  { tags: ["daily-data"] }
);
export const getLast30ReportsByCity = async () => {
  const defaultCity = await getPriceListCity();
  return getCachedLast30ReportsByCity(defaultCity);
};

const getCachedTotalUniqProductsCount = cacheToken(
  async (city: string): Promise<number> =>
    wrapApiCall("/api/analysis/total-uniq-products-count", { params: { city } }),
  ["total-uniq-products-count"],
  { tags: ["daily-data"] }
);
export const getTotalUniqProductsCount = async () => {
  const defaultCity = await getPriceListCity();
  return getCachedTotalUniqProductsCount(defaultCity);
};

export const getLLMCompareProducts = async (
  links: string[]
): Promise<{
  message: string;
  report: string;
}> => {
  return wrapApiCall("/api/llm/compare-products", { params: { links: links.join("|") } });
};

export const getLLMDescribeProduct = async (
  link: string
): Promise<{
  message: string;
  report: string;
}> => {
  return wrapApiCall("/api/llm/compare-products", { params: { link } });
};
