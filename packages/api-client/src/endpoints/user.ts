import type { Request } from "../request";
import type { Goods } from "@dns-markdown/types/pricelist";
import type {
  CityStatusResponse,
  FavoritesResponse,
  FavoritesStatusResponse,
  SectionsResponse,
  UserNotificationsResponse
} from "@dns-markdown/types/responses";
import type { User, UserNotifications } from "@dns-markdown/types/user";

// Every user route is a POST authorized by the caller's Clerk session token
export const createUserApi = (request: Request) => ({
  get: (token: string) => request.post<User>("/api/user", {}, token),
  updateNotifications: (token: string, notifications: UserNotifications) =>
    request.post<UserNotificationsResponse>(
      "/api/user/notifications-update",
      { notifications },
      token
    ),
  toggleShownBoughtFavorites: (token: string, status: boolean) =>
    request.post<FavoritesStatusResponse>(
      "/api/user/toggle-shown-bought-favorites",
      { status },
      token
    ),
  changeCity: (token: string, city: string) =>
    request.post<CityStatusResponse>("/api/user/change-city", { city }, token),
  addFavorite: (token: string, product: Goods, city: string) =>
    request.post<FavoritesResponse>(
      "/api/user/favorite-add",
      { product: { ...product, city } },
      token
    ),
  removeFavorite: (token: string, link: string) =>
    request.post<FavoritesResponse>("/api/user/favorite-remove", { link }, token),
  addHiddenSection: (token: string, title: string) =>
    request.post<SectionsResponse>("/api/user/hidden-section-add", { title }, token),
  removeHiddenSection: (token: string, title: string) =>
    request.post<SectionsResponse>("/api/user/hidden-section-remove", { title }, token),
  addFavoriteSection: (token: string, title: string) =>
    request.post<SectionsResponse>("/api/user/favorite-section-add", { title }, token),
  removeFavoriteSection: (token: string, title: string) =>
    request.post<SectionsResponse>("/api/user/favorite-section-remove", { title }, token)
});
