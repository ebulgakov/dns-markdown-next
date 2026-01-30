import axios from "axios";

import type { PriceList } from "@/types/pricelist";

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
