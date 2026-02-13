"use server";

import { auth } from "@clerk/nextjs/server";
import { unstable_cache as cacheToken, revalidateTag } from "next/cache";
import { cache } from "react";

import { apiClient } from "@/services/client";

import type { Goods } from "@/types/pricelist";
import type { Favorite, User, UserNotifications, UserSections } from "@/types/user";

export type FavoritesResponse = { message: string; favorites: Favorite[] };
export type FavoritesStatusResponse = { message: string; shownBoughtFavorites: boolean };
export type CityStatusResponse = { message: string; city: string };

export type SectionsResponse = {
  message: string;
  sections: UserSections;
};

export type UserNotificationsResponse = {
  message: string;
  notifications: UserNotifications;
};

const wrapApiCall = async (endpoint: string, token: string | null, data = {}) => {
  try {
    if (!token) return null;

    const response = await apiClient.post(endpoint, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Just for performance optimization. Avoid calling auth() multiple times in the same request.
export const getSessionInfo = cache(async () => {
  const { getToken, userId } = await auth();
  const token = await getToken();
  return { token, userId };
});

export const postUpdateUserNotifications = async (
  notifications: UserNotifications
): Promise<UserNotificationsResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  return await wrapApiCall("/api/user/notifications-update", token, { notifications });
};

export const postToggleFavoriteShownBought = async (
  shownBoughtFavorites: boolean
): Promise<FavoritesStatusResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  return await wrapApiCall("/api/user/toggle-shown-bought-favorites", token, {
    status: shownBoughtFavorites
  });
};

export const postChangeUserCity = async (city: string): Promise<CityStatusResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  return await wrapApiCall("/api/user/change-city", token, { city });
};

// User Favorites API
export const postAddToFavorites = async (
  product: Goods,
  city: string
): Promise<FavoritesResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  return await wrapApiCall("/api/user/favorite-add", token, {
    product: {
      ...product,
      city
    }
  });
};

export const postRemoveFromFavorites = async (link: string): Promise<FavoritesResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  return await wrapApiCall("/api/user/favorite-remove", token, { link });
};

// User Sections API
export const postAddToHiddenSections = async (title: string): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  return await wrapApiCall("/api/user/hidden-section-add", token, { title });
};

export const postRemoveFromHiddenSections = async (
  title: string
): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  return await wrapApiCall("/api/user/hidden-section-remove", token, { title });
};

export const postAddToFavoriteSections = async (
  title: string
): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  return await wrapApiCall("/api/user/favorite-section-add", token, { title });
};

export const postRemoveFromFavoriteSection = async (
  title: string
): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  return await wrapApiCall("/api/user/favorite-section-remove", token, { title });
};

// User Data API. Used pattern "Memoized Factor". Fabricated with caching.
const fetchUser = async (token: string) => wrapApiCall("/api/user", token);
const getCachedUserForId = (userId: string, token: string) =>
  cacheToken(async () => fetchUser(token), ["user-profile", userId], { tags: [`user-${userId}`] });
export const getUser = async (): Promise<User | null> => {
  const { token, userId } = await getSessionInfo();
  if (!userId || !token) return null;

  return getCachedUserForId(userId, token)();
};
