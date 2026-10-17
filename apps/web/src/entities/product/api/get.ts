"use server";

import { unstable_cache as cacheToken } from "next/cache";

import { api } from "@/shared/api";

import type { Goods, PriceList, PriceListDate, PriceListsArchiveCount } from "../model/pricelist";
import type { ProductPayload } from "../model/product";
import type { AnalysisDiff, AnalysisDiffReport } from "@/types/analysis-diff";
import type { ReportsResponse } from "@/types/reports";
import type { LLMResponse } from "@dns-markdown/types/responses";

const getCachedPriceList = cacheToken(
  async (city: string): Promise<PriceList | null> => {
    return api.pricelist.getLast(city);
  },
  ["last-pricelist"],
  { tags: ["daily-data"] }
);
export const getLastPriceList = async (city: string) => {
  return getCachedPriceList(city);
};

const getCachedArchiveListDates = cacheToken(
  async (city: string): Promise<PriceListDate[]> => api.pricelist.getDates(city),
  ["archive-list-dates"],
  { tags: ["daily-data"] }
);
export const getArchiveListDates = async (city: string) => {
  return getCachedArchiveListDates(city);
};

const getCachedPriceListById = cacheToken(
  async (id: string): Promise<PriceList> => api.pricelist.getById(id),
  ["pricelist-by-id"],
  { tags: ["daily-data"] }
);
export const getPriceListById = async (id: string) => getCachedPriceListById(id);

const getCachedProductByLink = cacheToken(
  async (link: string): Promise<ProductPayload> => api.products.getByLink(link),
  ["product-by-link"],
  { tags: ["daily-data"] }
);
export const getProductByLink = async (link: string) => getCachedProductByLink(link);

const getCachedMostCheapProducts = cacheToken(
  async (city: string): Promise<Goods[]> => api.products.getMostCheap(city),
  ["most-cheap-products"],
  { tags: ["daily-data"] }
);
export const getMostCheapProducts = async (city: string) => {
  return getCachedMostCheapProducts(city);
};

const getCachedMostDiscountedProducts = cacheToken(
  async (city: string): Promise<Goods[]> => api.products.getMostDiscounted(city),
  ["most-discounted-products"],
  { tags: ["daily-data"] }
);
export const getMostDiscountedProducts = async (city: string) => {
  return getCachedMostDiscountedProducts(city);
};

const getCachedMostProfitableProducts = cacheToken(
  async (city: string): Promise<Goods[]> => api.products.getMostProfitable(city),
  ["most-profitable-products"],
  { tags: ["daily-data"] }
);
export const getMostProfitableProducts = async (city: string) => {
  return getCachedMostProfitableProducts(city);
};

const getCachedLastDiffByCity = cacheToken(
  async (city: string): Promise<AnalysisDiff> => api.analysis.getLastDiff(city),
  ["last-diff-by-city"],
  { tags: ["daily-data"] }
);
export const getLastDiffByCity = async (city: string) => {
  return getCachedLastDiffByCity(city);
};

const getCachedLast30DiffsReportByCity = cacheToken(
  async (city: string): Promise<AnalysisDiffReport[]> => api.analysis.getAllDiffs(city),
  ["last-30-diffs-report-by-city"],
  { tags: ["daily-data"] }
);
export const getLast30DiffsReportByCity = async (city: string) => {
  return getCachedLast30DiffsReportByCity(city);
};

const getCachedLast30ArchiveProductsCount = cacheToken(
  async (city: string): Promise<PriceListsArchiveCount[]> => api.analysis.getProductsCount(city),
  ["last-30-archive-products-count"],
  { tags: ["daily-data"] }
);
export const getLast30ArchiveProductsCount = async (city: string) => {
  return getCachedLast30ArchiveProductsCount(city);
};

const getCachedLast30ReportsByCity = cacheToken(
  async (city: string): Promise<ReportsResponse> => api.analysis.getReports(city),
  ["last-30-reports-by-city"],
  { tags: ["daily-data"] }
);
export const getLast30ReportsByCity = async (city: string) => {
  return getCachedLast30ReportsByCity(city);
};

const getCachedTotalUniqProductsCount = cacheToken(
  async (city: string): Promise<number> => api.analysis.getTotalUniqProductsCount(city),
  ["total-uniq-products-count"],
  { tags: ["daily-data"] }
);
export const getTotalUniqProductsCount = async (city: string) => {
  return getCachedTotalUniqProductsCount(city);
};

// Cached by the stringified links (stable cache key); the client stringifies them again for the API
const getCachedLLMCompareProducts = cacheToken(
  async (links: string): Promise<LLMResponse> => api.llm.compareProducts(JSON.parse(links)),
  ["llm-compare-products"],
  { tags: ["llm-report"] }
);

export const getLLMCompareProducts = async (links: string[]) => {
  const stringifiedLinks = JSON.stringify(links);
  return getCachedLLMCompareProducts(stringifiedLinks);
};

const getCachedLLMDescribeProduct = cacheToken(
  async (link: string): Promise<LLMResponse> => api.llm.describeProduct(link),
  ["llm-describe-product"],
  { tags: ["llm-report"] }
);

export const getLLMDescribeProduct = async (link: string) => {
  return getCachedLLMDescribeProduct(link);
};
