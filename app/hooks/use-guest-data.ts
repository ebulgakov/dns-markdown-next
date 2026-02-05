"use client";

import useLocalStorage from "use-local-storage";

import type { User, UserSections } from "@/types/user";

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

  return { guestData, setGuestFavoriteSections, setGuestHiddenSections };
};
