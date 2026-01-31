import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";

import type { AnalysisDiff, AnalysisDiffReport } from "@/types/analysis-diff";
import type { Goods, PriceList, PriceListDate, PriceListsArchiveCount } from "@/types/pricelist";
import type { ProductPayload } from "@/types/product";
import type { ReportsResponse } from "@/types/reports";
import type { User } from "@/types/user";

const API_BASE_URL = process.env.API_URL!;

const wrapApiCall = async (endpoint: string, options = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { Authorization: `Bearer ${process.env.API_AUTH_SECRET}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const getLastPriceList = async (city: string): Promise<PriceList> => {
  return await wrapApiCall("/api/pricelist", { params: { city } });
};

export const getArchiveListDates = async (city: string): Promise<PriceListDate[]> => {
  return await wrapApiCall("/api/pricelist/list", { params: { city } });
};

export const getPriceListById = async (id: string): Promise<PriceList> => {
  return await wrapApiCall(`/api/pricelist/id/${id}`);
};

export const getUser = async (): Promise<User> => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall(`/api/user/id/${clerkUser.id}`);
};

export const getPriceListCity = async (): Promise<string> => {
  try {
    const user = await getUser();
    return user.city;
  } catch {
    return process.env.DEFAULT_CITY || "samara";
  }
};

export const getProductByLink = async (link: string): Promise<ProductPayload> => {
  return await wrapApiCall(`/api/products/link`, { params: { link } });
};

export const getMostCheapProducts = async (city: string): Promise<Goods[]> => {
  return await wrapApiCall(`/api/products/most-cheap-products`, { params: { city } });
};

export const getMostDiscountedProducts = async (city: string): Promise<Goods[]> => {
  return await wrapApiCall(`/api/products/most-discounted-products`, { params: { city } });
};

export const getMostProfitableProducts = async (city: string): Promise<Goods[]> => {
  return await wrapApiCall(`/api/products/most-profitable-products`, { params: { city } });
};

export const getLastDiffByCity = async (city: string): Promise<AnalysisDiff> => {
  return await wrapApiCall(`/api/analysis/last-diff`, { params: { city } });
};

export const getLast30DiffsReportByCity = async (city: string): Promise<AnalysisDiffReport[]> => {
  return await wrapApiCall(`/api/analysis/all-diffs`, { params: { city } });
};

export const getLast30ArchiveProductsCount = async (
  city: string
): Promise<PriceListsArchiveCount[]> => {
  return await wrapApiCall("/api/analysis/products-count", { params: { city } });
};

export const getLast30ReportsByCity = async (city: string): Promise<ReportsResponse> => {
  return await wrapApiCall("/api/analysis/reports", { params: { city } });
};
