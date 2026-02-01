import axios from "axios";
import { PriceList } from "#types/pricelist.ts";
import { AnalysisData } from "#types/analysis-data.js";

const API_BASE_URL = process.env.API_URL!;

const wrapApiCall = async (endpoint: string, options = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { Authorization: `Bearer ${process.env.API_SERVICE_SECRET}` }
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

export const getAllPriceLists = async (city: string): Promise<PriceList[]> => {
  return await wrapApiCall("/service/all-price-lists", { params: { city } });
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
