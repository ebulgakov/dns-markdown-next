import "dotenv/config";
import type { PriceList } from "#types/pricelist.ts";
import type { AnalysisData } from "#types/analysis-data.ts";
import type { User } from "#types/user.ts";
import { apiClient } from "#api/client.ts";

const wrapApiCall = async (endpoint: string, options = {}) => {
  try {
    const response = await apiClient.get(endpoint, options);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const getLastPriceList = async (city: string): Promise<PriceList> => {
  return await wrapApiCall("/api/pricelist", { params: { city } });
};

export const getAllPriceLists = async ({
  city,
  limit
}: {
  city: string;
  limit?: number;
}): Promise<PriceList[]> => {
  return await wrapApiCall("/service/all-price-lists", { params: { city, limit } });
};

export const getAllNotificationUsers = async (city: string): Promise<User[]> => {
  return await wrapApiCall("/service/all-notification-users", { params: { city } });
};

export const getAnalysisGoodsByDateAdded = async ({
  city,
  date
}: {
  city: string;
  date: string;
}): Promise<AnalysisData[]> => {
  return await wrapApiCall("/api/analysis/all-analysis-goods-by-date-added", {
    params: {
      city,
      dateAdded: date
    }
  });
};
