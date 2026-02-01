"use server";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";

import type { Goods } from "@/types/pricelist";
import type { Favorite, UserNotifications, UserSections } from "@/types/user";

const API_BASE_URL = process.env.API_URL!;

type FavoritesResponse = { message: string; favorites: Favorite[] };

export type SectionsResponse = {
  message: string;
  sections: UserSections;
};

export type UserNotificationsResponse = {
  message: string;
  notifications: UserNotifications;
};

const wrapApiCall = async (endpoint: string, data = {}) => {
  try {
    const { getToken } = await auth();
    const sessionToken = await getToken();

    if (!sessionToken) throw new Error("User session token not found");

    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: { Authorization: `Bearer ${sessionToken}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const postUpdateUserNotifications = async (
  notifications: UserNotifications
): Promise<UserNotificationsResponse> => {
  return await wrapApiCall("/user-actions/notifications-update", { notifications });
};

export const postToggleFavoriteShownBought = async (
  shownBoughtFavorites: boolean
): Promise<{ message: string; showBoughtFavorites: boolean }> => {
  return await wrapApiCall("/user-actions/toggle-shown-bought-favorites", {
    status: shownBoughtFavorites
  });
};

// User Favorites API
export const postAddToFavorites = async (product: Goods): Promise<FavoritesResponse> => {
  return await wrapApiCall("/user-actions/favorite-add", { product });
};

export const postRemoveFromFavorites = async (link: string): Promise<FavoritesResponse> => {
  return await wrapApiCall("/user-actions/favorite-remove", { link });
};

// User Sections API
export const postAddToHiddenSections = async (title: string): Promise<SectionsResponse> => {
  return await wrapApiCall("/user-actions/hidden-section-add", { title });
};

export const postRemoveFromHiddenSections = async (title: string): Promise<SectionsResponse> => {
  return await wrapApiCall("/user-actions/hidden-section-remove", { title });
};

export const postAddToFavoriteSections = async (title: string): Promise<SectionsResponse> => {
  return await wrapApiCall("/user-actions/favorite-section-add", { title });
};

export const postRemoveFromFavoriteSection = async (title: string): Promise<SectionsResponse> => {
  return await wrapApiCall("/user-actions/favorite-section-remove", { title });
};
