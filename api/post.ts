"use server";

import { auth } from "@clerk/nextjs/server";

import { apiClient } from "@/api/client";

import type { Goods } from "@/types/pricelist";
import type { Favorite, User, UserNotifications, UserSections } from "@/types/user";

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

    if (!sessionToken) return null;

    const response = await apiClient.post(endpoint, data, {
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
): Promise<UserNotificationsResponse | null> => {
  return await wrapApiCall("/api/user/notifications-update", { notifications });
};

export const postToggleFavoriteShownBought = async (
  shownBoughtFavorites: boolean
): Promise<{ message: string; shownBoughtFavorites: boolean } | null> => {
  return await wrapApiCall("/api/user/toggle-shown-bought-favorites", {
    status: shownBoughtFavorites
  });
};

// User Favorites API
export const postAddToFavorites = async (product: Goods): Promise<FavoritesResponse | null> => {
  return await wrapApiCall("/api/user/favorite-add", { product });
};

export const postRemoveFromFavorites = async (link: string): Promise<FavoritesResponse | null> => {
  return await wrapApiCall("/api/user/favorite-remove", { link });
};

// User Sections API
export const postAddToHiddenSections = async (title: string): Promise<SectionsResponse | null> => {
  return await wrapApiCall("/api/user/hidden-section-add", { title });
};

export const postRemoveFromHiddenSections = async (
  title: string
): Promise<SectionsResponse | null> => {
  return await wrapApiCall("/api/user/hidden-section-remove", { title });
};

export const postAddToFavoriteSections = async (
  title: string
): Promise<SectionsResponse | null> => {
  return await wrapApiCall("/api/user/favorite-section-add", { title });
};

export const postRemoveFromFavoriteSection = async (
  title: string
): Promise<SectionsResponse | null> => {
  return await wrapApiCall("/api/user/favorite-section-remove", { title });
};

export const getUser = async (): Promise<User | null> => {
  return await wrapApiCall("/api/user");
};
