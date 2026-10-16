"use server";

import { unstable_cache as cacheToken } from "next/cache";

import { apiClient } from "@/shared/api";

import type { Goods, PriceList, PriceListDate, PriceListsArchiveCount } from "../model/pricelist";
import type { ProductPayload } from "../model/product";
import type { AnalysisDiff, AnalysisDiffReport } from "@/types/analysis-diff";
import type { ReportsResponse } from "@/types/reports";

type LLMResponse = {
  message: string;
  report: string;
};

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
export const getLastPriceList = async (city: string) => {
  return getCachedPriceList(city);
};

const getCachedArchiveListDates = cacheToken(
  async (city: string): Promise<PriceListDate[]> =>
    wrapApiCall("/api/pricelist/list", { params: { city } }),
  ["archive-list-dates"],
  { tags: ["daily-data"] }
);
export const getArchiveListDates = async (city: string) => {
  return getCachedArchiveListDates(city);
};

const getCachedPriceListById = cacheToken(
  async (id: string): Promise<PriceList> => wrapApiCall(`/api/pricelist/id/${id}`),
  ["pricelist-by-id"],
  { tags: ["daily-data"] }
);
export const getPriceListById = async (id: string) => getCachedPriceListById(id);

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
export const getMostCheapProducts = async (city: string) => {
  return getCachedMostCheapProducts(city);
};

const getCachedMostDiscountedProducts = cacheToken(
  async (city: string): Promise<Goods[]> =>
    wrapApiCall("/api/products/most-discounted-products", { params: { city } }),
  ["most-discounted-products"],
  { tags: ["daily-data"] }
);
export const getMostDiscountedProducts = async (city: string) => {
  return getCachedMostDiscountedProducts(city);
};

const getCachedMostProfitableProducts = cacheToken(
  async (city: string): Promise<Goods[]> =>
    wrapApiCall("/api/products/most-profitable-products", { params: { city } }),
  ["most-profitable-products"],
  { tags: ["daily-data"] }
);
export const getMostProfitableProducts = async (city: string) => {
  return getCachedMostProfitableProducts(city);
};

const getCachedLastDiffByCity = cacheToken(
  async (city: string): Promise<AnalysisDiff> =>
    wrapApiCall("/api/analysis/last-diff", { params: { city } }),
  ["last-diff-by-city"],
  { tags: ["daily-data"] }
);
export const getLastDiffByCity = async (city: string) => {
  return getCachedLastDiffByCity(city);
};

const getCachedLast30DiffsReportByCity = cacheToken(
  async (city: string): Promise<AnalysisDiffReport[]> =>
    wrapApiCall("/api/analysis/all-diffs", { params: { city } }),
  ["last-30-diffs-report-by-city"],
  { tags: ["daily-data"] }
);
export const getLast30DiffsReportByCity = async (city: string) => {
  return getCachedLast30DiffsReportByCity(city);
};

const getCachedLast30ArchiveProductsCount = cacheToken(
  async (city: string): Promise<PriceListsArchiveCount[]> =>
    wrapApiCall("/api/analysis/products-count", { params: { city } }),
  ["last-30-archive-products-count"],
  { tags: ["daily-data"] }
);
export const getLast30ArchiveProductsCount = async (city: string) => {
  return getCachedLast30ArchiveProductsCount(city);
};

const getCachedLast30ReportsByCity = cacheToken(
  async (city: string): Promise<ReportsResponse> =>
    wrapApiCall("/api/analysis/reports", { params: { city } }),
  ["last-30-reports-by-city"],
  { tags: ["daily-data"] }
);
export const getLast30ReportsByCity = async (city: string) => {
  return getCachedLast30ReportsByCity(city);
};

const getCachedTotalUniqProductsCount = cacheToken(
  async (city: string): Promise<number> =>
    wrapApiCall("/api/analysis/total-uniq-products-count", { params: { city } }),
  ["total-uniq-products-count"],
  { tags: ["daily-data"] }
);
export const getTotalUniqProductsCount = async (city: string) => {
  return getCachedTotalUniqProductsCount(city);
};

const getCachedLLMCompareProducts = cacheToken(
  async (links: string): Promise<LLMResponse> =>
    wrapApiCall("/api/llm/compare-products", { params: { links } }),
  ["llm-compare-products"],
  { tags: ["llm-report"] }
);

export const getLLMCompareProducts = async (links: string[]) => {
  const stringifiedLinks = JSON.stringify(links);
  return getCachedLLMCompareProducts(stringifiedLinks);
};

const getCachedLLMDescribeProduct = cacheToken(
  async (link: string): Promise<LLMResponse> =>
    wrapApiCall("/api/llm/describe-product", { params: { link } }),
  ["llm-describe-product"],
  { tags: ["llm-report"] }
);

export const getLLMDescribeProduct = async (link: string) => {
  return getCachedLLMDescribeProduct(link);
};
