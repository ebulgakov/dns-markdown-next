"use server";

import { currentUser } from "@clerk/nextjs/server";
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
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: { Authorization: `Bearer ${process.env.API_AUTH_SECRET}` }
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
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall("/api/user/notifications/update", {
    userId: clerkUser.id,
    notifications
  });
};

export const postToggleFavoriteShownBought = async (
  shownBoughtFavorites: boolean
): Promise<{ message: string; showBoughtFavorites: boolean }> => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall("/api/user/toggle-shown-bought-favorites", {
    userId: clerkUser.id,
    status: shownBoughtFavorites
  });
};

// User Favorites API
export const postAddToFavorites = async (product: Goods): Promise<FavoritesResponse> => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall("/api/user/favorites/add", { product, userId: clerkUser.id });
};

export const postRemoveFromFavorites = async (link: string): Promise<FavoritesResponse> => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall("/api/user/favorites/remove", { link, userId: clerkUser.id });
};

// User Sections API
export const postAddToHiddenSections = async (title: string): Promise<SectionsResponse> => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall("/api/user/sections/hidden-add", { title, userId: clerkUser.id });
};

export const postRemoveFromHiddenSections = async (title: string): Promise<SectionsResponse> => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall("/api/user/sections/hidden-remove", { title, userId: clerkUser.id });
};

export const postAddToFavoriteSections = async (title: string): Promise<SectionsResponse> => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall("/api/user/sections/favorite-add", { title, userId: clerkUser.id });
};

export const postRemoveFromFavoriteSection = async (title: string): Promise<SectionsResponse> => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");
  return await wrapApiCall("/api/user/sections/favorite-remove", { title, userId: clerkUser.id });
};
