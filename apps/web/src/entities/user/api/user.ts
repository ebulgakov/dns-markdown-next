"use server";

import { auth } from "@clerk/nextjs/server";
import { unstable_cache as cacheToken, revalidateTag } from "next/cache";
import { cache } from "react";

import { api } from "@/shared/api";

import type { Goods } from "@dns-markdown/types/pricelist";
import type {
  CityStatusResponse,
  FavoritesResponse,
  FavoritesStatusResponse,
  SectionsResponse,
  UserNotificationsResponse
} from "@dns-markdown/types/responses";
import type { User, UserNotifications } from "@dns-markdown/types/user";

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
  if (!token) return null;
  return api.user.updateNotifications(token, notifications);
};

export const postToggleFavoriteShownBought = async (
  shownBoughtFavorites: boolean
): Promise<FavoritesStatusResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  if (!token) return null;
  return api.user.toggleShownBoughtFavorites(token, shownBoughtFavorites);
};

export const postChangeUserCity = async (city: string): Promise<CityStatusResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  if (!token) return null;
  return api.user.changeCity(token, city);
};

// User Favorites API
export const postAddToFavorites = async (
  product: Goods,
  city: string
): Promise<FavoritesResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  if (!token) return null;
  return api.user.addFavorite(token, product, city);
};

export const postRemoveFromFavorites = async (link: string): Promise<FavoritesResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  if (!token) return null;
  return api.user.removeFavorite(token, link);
};

// User Sections API
export const postAddToHiddenSections = async (title: string): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  if (!token) return null;
  return api.user.addHiddenSection(token, title);
};

export const postRemoveFromHiddenSections = async (
  title: string
): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  if (!token) return null;
  return api.user.removeHiddenSection(token, title);
};

export const postAddToFavoriteSections = async (
  title: string
): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  if (!token) return null;
  return api.user.addFavoriteSection(token, title);
};

export const postRemoveFromFavoriteSection = async (
  title: string
): Promise<SectionsResponse | null> => {
  const { token, userId } = await getSessionInfo();
  revalidateTag(`user-${userId}`, { expire: 0 });
  if (!token) return null;
  return api.user.removeFavoriteSection(token, title);
};

// User Data API. Used pattern "Memoized Factor". Fabricated with caching.
const fetchUser = async (token: string) => api.user.get(token);
const getCachedUserForId = (userId: string, token: string) =>
  cacheToken(async () => fetchUser(token), ["user-profile", userId], { tags: [`user-${userId}`] });
// react cache() dedupes calls within one request (layout.tsx + a page both call this);
// the unstable_cache above only dedupes across requests, not concurrent calls in the same one.
export const getUser = cache(async (): Promise<User | null> => {
  const { token, userId } = await getSessionInfo();
  if (!userId || !token) return null;

  return getCachedUserForId(userId, token)();
});
