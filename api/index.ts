import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";

import type { PriceList, PriceListDate } from "@/types/pricelist";
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
  return await wrapApiCall("/api/archive/list", { params: { city } });
};

export const getPriceListById = async (id: string): Promise<PriceList> => {
  return await wrapApiCall(`/api/archive/id/${id}`);
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
