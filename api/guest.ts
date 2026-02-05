"use client";

import type { Goods } from "@/types/pricelist";
import type { UserNotifications } from "@/types/user";

export const postUpdateUserNotifications = async (notifications: UserNotifications) => {};
export const postToggleFavoriteShownBought = async (shownBoughtFavorites: boolean) => {};
export const postAddToFavorites = async (product: Goods) => {};
export const postRemoveFromFavorites = async (link: string) => {};
export const postAddToHiddenSections = async (title: string) => {};
export const postRemoveFromHiddenSections = async (title: string) => {};
export const postAddToFavoriteSections = async (title: string) => {};
export const postRemoveFromFavoriteSection = async (title: string) => {};
export const getUser = async () => {
  localStorage.setItem("project", "DNS");
  const project = localStorage.getItem("project");

  console.log(project);
};
