"use server";

import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";

import type { Goods } from "@/types/pricelist";

const API_BASE_URL = process.env.API_URL!;

const wrapApiCall = async (endpoint: string, data = {}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: { Authorization: `Bearer ${process.env.API_AUTH_SECRET}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const postAddToFavorites = async (product: Goods): Promise<{ success: boolean }> => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall("/api/favorites/add", { product });
};

export const postRemoveFromFavorites = async (link: string): Promise<{ success: boolean }> => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall("/api/favorites/remove", { link });
};
