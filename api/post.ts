"use server";

import { auth } from "@clerk/nextjs/server";
import { unstable_cache as cacheToken, revalidateTag } from "next/cache";
import { cache } from "react";

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

const getSessionToken = cache(async () => {
  const { getToken, userId } = await auth();
  const token = await getToken();
  return { token, userId };
});

export const postUpdateUserNotifications = async (
  notifications: UserNotifications
): Promise<UserNotificationsResponse | null> => {
  const { token, userId } = await getSessionToken();
  revalidateTag(`user-${userId}`, { expire: Date.now() });
  return await wrapApiCall("/api/user/notifications-update", token, { notifications });
};

export const postToggleFavoriteShownBought = async (
  shownBoughtFavorites: boolean
): Promise<{ message: string; shownBoughtFavorites: boolean } | null> => {
  const { token, userId } = await getSessionToken();
  revalidateTag(`user-${userId}`, { expire: Date.now() });
  return await wrapApiCall("/api/user/toggle-shown-bought-favorites", token, {
    status: shownBoughtFavorites
  });
};

// User Favorites API
export const postAddToFavorites = async (product: Goods): Promise<FavoritesResponse | null> => {
  const { token, userId } = await getSessionToken();
  revalidateTag(`user-${userId}`, { expire: Date.now() });
  return await wrapApiCall("/api/user/favorite-add", token, { product });
};

export const postRemoveFromFavorites = async (link: string): Promise<FavoritesResponse | null> => {
  const { token, userId } = await getSessionToken();
  revalidateTag(`user-${userId}`, { expire: Date.now() });
  return await wrapApiCall("/api/user/favorite-remove", token, { link });
};

// User Sections API
export const postAddToHiddenSections = async (title: string): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionToken();
  revalidateTag(`user-${userId}`, { expire: Date.now() });
  return await wrapApiCall("/api/user/hidden-section-add", token, { title });
};

export const postRemoveFromHiddenSections = async (
  title: string
): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionToken();
  revalidateTag(`user-${userId}`, { expire: Date.now() });
  return await wrapApiCall("/api/user/hidden-section-remove", token, { title });
};

export const postAddToFavoriteSections = async (
  title: string
): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionToken();
  revalidateTag(`user-${userId}`, { expire: Date.now() });
  return await wrapApiCall("/api/user/favorite-section-add", token, { title });
};

export const postRemoveFromFavoriteSection = async (
  title: string
): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionToken();
  revalidateTag(`user-${userId}`, { expire: Date.now() });
  return await wrapApiCall("/api/user/favorite-section-remove", token, { title });
};

export const getUser = async (): Promise<User | null> => {
  const { token, userId } = await getSessionToken();

  const getCachedUserForId = cacheToken(
    (token: string | null) => wrapApiCall("/api/user", token),
    ["user", `${userId}`], // Cache key includes userId to differentiate users
    { tags: [`user-${userId}`] } // Tag for cache invalidation
  );

  return getCachedUserForId(token);
};
