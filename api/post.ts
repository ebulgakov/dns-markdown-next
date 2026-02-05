"use server";

import {
  getGuest,
  addToHiddenSections as addToHiddenSectionsGuest,
  removeFromHiddenSections as removeFromHiddenSectionsGuest,
  addToFavoriteSections as addToFavoriteSectionsGuest,
  removeFromFavoriteSections as removeFromFavoriteSectionsGuest,
  addToFavorites as addToFavoritesGuest,
  removeFromFavorites as removeFromFavoritesGuest
} from "@/api/guest";

import {
  postUpdateUserNotifications as postUpdateUserNotificationsUser,
  postToggleFavoriteShownBought as postToggleFavoriteShownBoughtUser,
  postAddToFavorites as postAddToFavoritesUser,
  postRemoveFromFavorites as postRemoveFromFavoritesUser,
  postAddToHiddenSections as postAddToHiddenSectionsUser,
  postRemoveFromHiddenSections as postRemoveFromHiddenSectionsUser,
  postAddToFavoriteSections as postAddToFavoriteSectionsUser,
  postRemoveFromFavoriteSection as postRemoveFromFavoriteSectionUser,
  getUser as getUserUser,
  getSessionInfo
} from "./user";

import type { Goods } from "@/types/pricelist";
import type { UserNotifications } from "@/types/user";

export const postUpdateUserNotifications = async (notifications: UserNotifications) => {
  const { userId } = await getSessionInfo();

  if (userId) {
    return await postUpdateUserNotificationsUser(notifications);
  } else {
    return null;
  }
};

export const postToggleFavoriteShownBought = async (shownBoughtFavorites: boolean) => {
  const { userId } = await getSessionInfo();

  if (userId) {
    return await postToggleFavoriteShownBoughtUser(shownBoughtFavorites);
  } else {
    return null;
  }
};

export const postAddToFavorites = async (product: Goods) => {
  const { userId } = await getSessionInfo();

  if (userId) {
    return await postAddToFavoritesUser(product);
  } else {
    return await addToFavoritesGuest(product);
  }
};

export const postRemoveFromFavorites = async (link: string) => {
  const { userId } = await getSessionInfo();

  if (userId) {
    return await postRemoveFromFavoritesUser(link);
  } else {
    return await removeFromFavoritesGuest(link);
  }
};

export const postAddToHiddenSections = async (title: string) => {
  const { userId } = await getSessionInfo();

  if (userId) {
    return await postAddToHiddenSectionsUser(title);
  } else {
    return await addToHiddenSectionsGuest(title);
  }
};

export const postRemoveFromHiddenSections = async (title: string) => {
  const { userId } = await getSessionInfo();

  if (userId) {
    return await postRemoveFromHiddenSectionsUser(title);
  } else {
    return await removeFromHiddenSectionsGuest(title);
  }
};

export const postAddToFavoriteSections = async (title: string) => {
  const { userId } = await getSessionInfo();

  if (userId) {
    return await postAddToFavoriteSectionsUser(title);
  } else {
    return await addToFavoriteSectionsGuest(title);
  }
};

export const postRemoveFromFavoriteSection = async (title: string) => {
  const { userId } = await getSessionInfo();

  if (userId) {
    return await postRemoveFromFavoriteSectionUser(title);
  } else {
    return await removeFromFavoriteSectionsGuest(title);
  }
};

export const getUser = async () => {
  const { userId } = await getSessionInfo();

  if (userId) {
    return await getUserUser();
  } else {
    return await getGuest();
  }
};

export type { SectionsResponse } from "@/api/user";
