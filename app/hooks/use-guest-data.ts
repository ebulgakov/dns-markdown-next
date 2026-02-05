"use client";

import type { User, UserSections } from "@/types/user";

export const useGuestData = () => {
  const userLocalStorage = typeof window !== "undefined" ? window.localStorage : null;
  const collectionName = "dns-markdown-guest-data";

  const setGuestData = (data: User) => {
    userLocalStorage?.setItem(collectionName, JSON.stringify(data));
  };

  const getGuestData = () => {
    const guestData = userLocalStorage?.getItem(collectionName);

    if (guestData) {
      return JSON.parse(guestData);
    } else {
      const newUser: User = {
        _id: "0",
        userId: "0",
        email: "",
        city: "Sample City",
        favorites: [],
        notifications: { updates: { enabled: false } },
        hiddenSections: [],
        favoriteSections: [],
        shownBoughtFavorites: true
      };
      setGuestData(newUser);
      return newUser;
    }
  };

  const setGuestFavoriteSections = (sections: UserSections) => {
    const guestData = getGuestData();

    const updatedData = { ...guestData, favoriteSections: sections };
    setGuestData(updatedData);
  };

  const setGuestHiddenSections = (sections: UserSections) => {
    const guestData = getGuestData();

    const updatedData = { ...guestData, hiddenSections: sections };
    setGuestData(updatedData);
  };

  return { getGuestData, setGuestFavoriteSections, setGuestHiddenSections };
};
