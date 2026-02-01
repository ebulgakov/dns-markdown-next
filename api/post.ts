import axios from "axios";
import { Position, PriceList } from "#types/pricelist.ts";

const API_BASE_URL = process.env.API_URL!;

const wrapApiCall = async (endpoint: string, data = {}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: { Authorization: `Bearer ${process.env.API_SERVICE_SECRET}` }
    });
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
