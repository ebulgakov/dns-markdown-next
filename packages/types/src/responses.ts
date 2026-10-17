import type { Favorite, UserNotifications, UserSections } from "./user";

export type LLMResponse = {
  message: string;
  report: string;
};

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
