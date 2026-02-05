import "dotenv/config";
import type { Position, PriceList } from "#types/pricelist.ts";
import type { AnalysisData } from "#types/analysis-data.ts";
import type { AnalysisDiff } from "#types/analysis-diff.js";
import type { User } from "#types/user.js";
import { apiClient, webClient } from "#api/client.ts";

const wrapApiCall = async (endpoint: string, data = {}) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const deleteLastPriceList = async (city: string): Promise<{ success: boolean }> => {
  return await wrapApiCall("/service/delete-last-price-list", { city });
};

export const savePriceList = async (
  city: string,
  positions: Position[]
): Promise<{ priceList: PriceList }> => {
  return await wrapApiCall("/service/add-new-price-list", { city, positions });
};

export const deleteReportByCityDate = async (params: {
  city: string;
  dateAdded: string;
}): Promise<{ success: boolean }> => {
  return await wrapApiCall("/service/delete-analysis-report-by-city-date", params);
};

export const addNewReportByCity = async (params: {
  city: string;
  report: string;
  dateAdded: string;
}): Promise<null> => {
  return await wrapApiCall("/service/add-analysis-report", params);
};

export const deleteAllAnalysisData = async (city: string): Promise<null> => {
  return await wrapApiCall("/service/delete-analysis-data", { city });
};

export const deleteAnalysisByDateData = async ({
  city,
  date
}: {
  city: string;
  date: string;
}): Promise<null> => {
  return await wrapApiCall("/service/delete-analysis-data-by-date", { city, dateAdded: date });
};

export const addManyAnalysisData = async (params: {
  analysisData: AnalysisData[];
}): Promise<null> => {
  return await wrapApiCall("/service/insert-analysis-data", params);
};

export const addManyAnalysisDiff = async (diff: AnalysisDiff[]): Promise<null> => {
  return await wrapApiCall("/service/insert-analysis-diff", { diff });
};

export const updateUsersFavorites = async (users: User[]): Promise<null> => {
  return await wrapApiCall("/service/update-users-favorites", { users });
};

export const deleteAnalysisDiffAll = async (city: string): Promise<null> => {
  return await wrapApiCall("/service/delete-analysis-diff", { city });
};

export const deleteAnalysisDiffByDate = async ({
  city,
  date
}: {
  city: string;
  date: string;
}): Promise<null> => {
  return await wrapApiCall("/service/delete-analysis-diff-by-date", { city, dateAdded: date });
};

export const clearCacheByKeys = async (keys: string): Promise<null> => {
  return await wrapApiCall("/service/clear-cache-by-key", { keys });
};

export const clearWebCache = async (tag: string): Promise<null> => {
  return await webClient.post("/api/revalidate", { tag });
};
