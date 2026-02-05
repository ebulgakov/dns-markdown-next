import type { User } from "@/types/user";

export const useGuestData = () => {
  const collectionName = "dns-markdown-guest-data";

  const setGuestData = (data: User) => {
    localStorage.setItem(collectionName, JSON.stringify(data));
  };

  const getGuestData = () => {
    const guestData = localStorage.getItem(collectionName);

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

  const clearGuestData = () => {
    localStorage.removeItem(collectionName);
  };

  return { getGuestData, setGuestData, clearGuestData };
};
