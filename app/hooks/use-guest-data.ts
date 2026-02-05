"use client";

import useLocalStorage from "use-local-storage";

import { Goods } from "@/types/pricelist";

import type { Favorite, User, UserSections } from "@/types/user";

export const useGuestData = () => {
  const newGuest: User = {
    _id: "0",
    userId: "0",
    email: "",
    city: "samara",
    favorites: [],
    notifications: { updates: { enabled: false } },
    hiddenSections: [],
    favoriteSections: [],
    shownBoughtFavorites: true
  };

  const [guestData, setGuestData] = useLocalStorage("dns-markdown-guest-data", newGuest);

  const setGuestFavoriteSections = (sections: UserSections) => {
    const updatedData = { ...guestData, favoriteSections: sections };
    setGuestData(updatedData);
  };

  const setGuestHiddenSections = (sections: UserSections) => {
    const updatedData = { ...guestData, hiddenSections: sections };
    setGuestData(updatedData);
  };

  const addToGuestFavorites = (product: Goods) => {
    const newFavorite: Favorite = {
      id: `${Date.now()}`,
      status: {
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      item: product
    };
    const updatedData = { ...guestData, favorites: [...guestData.favorites, newFavorite] };
    setGuestData(updatedData);
  };

  const removeFromGuestFavorites = (productLink: string) => {
    const updatedFavorites = guestData.favorites.filter(fav => fav.item.link !== productLink);
    const updatedData = { ...guestData, favorites: updatedFavorites };
    setGuestData(updatedData);
  };

  return {
    guestData,
    setGuestFavoriteSections,
    setGuestHiddenSections,
    addToGuestFavorites,
    removeFromGuestFavorites
  };
};
