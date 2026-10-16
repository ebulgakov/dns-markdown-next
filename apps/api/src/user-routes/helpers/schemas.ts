import { z } from "zod";

import type { RouteDoc } from "@src/openapi/types";

export const changeCitySchema = z.object({
  city: z.string().trim().min(1)
});

const reasonSchema = z.object({
  _id: z.string(),
  label: z.string(),
  text: z.string()
});

const goodsSchema = z.object({
  _id: z.string(),
  title: z.string(),
  link: z.string(),
  description: z.string(),
  reasons: z.array(reasonSchema),
  priceOld: z.string(),
  price: z.string(),
  profit: z.string(),
  code: z.string(),
  image: z.string(),
  available: z.string(),
  city: z.string()
});

export const addFavoriteSchema = z.object({
  product: goodsSchema
});

export const removeFavoriteSchema = z.object({
  link: z.string().trim().min(1, "link is required and must be a non-empty string.")
});

export const favoriteSectionAddSchema = z.object({
  title: z.string().trim().min(1, "title is required and must be a non-empty string.")
});

export const favoriteSectionRemoveSchema = z.object({
  title: z.string().trim().min(1, "title is required and must be a non-empty string.")
});

export const hiddenSectionAddSchema = z.object({
  title: z.string().trim().min(1, "title is required and must be a non-empty string.")
});

export const hiddenSectionRemoveSchema = z.object({
  title: z.string().trim().min(1, "title is required and must be a non-empty string.")
});

export const updateNotificationSchema = z.object({
  notifications: z.object({
    updates: z.object({
      enabled: z.boolean()
    })
  })
});

export const toggleShownBoughtFavoritesSchema = z.object({
  status: z.boolean()
});

export const userRouteDocs: RouteDoc[] = [
  {
    method: "post",
    path: "/api/user",
    summary: "Get the current user's profile",
    tags: ["User"],
    security: ["clerkAndApiSecret"]
  },
  {
    method: "post",
    path: "/api/user/notifications-update",
    summary: "Update the current user's notification settings",
    tags: ["User"],
    security: ["clerkAndApiSecret"],
    body: updateNotificationSchema
  },
  {
    method: "post",
    path: "/api/user/toggle-shown-bought-favorites",
    summary: "Toggle whether bought favorites are shown",
    tags: ["User"],
    security: ["clerkAndApiSecret"],
    body: toggleShownBoughtFavoritesSchema
  },
  {
    method: "post",
    path: "/api/user/hidden-section-add",
    summary: "Add a hidden section for the current user",
    tags: ["User"],
    security: ["clerkAndApiSecret"],
    body: hiddenSectionAddSchema
  },
  {
    method: "post",
    path: "/api/user/hidden-section-remove",
    summary: "Remove a hidden section for the current user",
    tags: ["User"],
    security: ["clerkAndApiSecret"],
    body: hiddenSectionRemoveSchema
  },
  {
    method: "post",
    path: "/api/user/favorite-section-add",
    summary: "Add a favorite section for the current user",
    tags: ["User"],
    security: ["clerkAndApiSecret"],
    body: favoriteSectionAddSchema
  },
  {
    method: "post",
    path: "/api/user/favorite-section-remove",
    summary: "Remove a favorite section for the current user",
    tags: ["User"],
    security: ["clerkAndApiSecret"],
    body: favoriteSectionRemoveSchema
  },
  {
    method: "post",
    path: "/api/user/favorite-add",
    summary: "Add a product to the current user's favorites",
    tags: ["User"],
    security: ["clerkAndApiSecret"],
    body: addFavoriteSchema
  },
  {
    method: "post",
    path: "/api/user/favorite-remove",
    summary: "Remove a product from the current user's favorites",
    tags: ["User"],
    security: ["clerkAndApiSecret"],
    body: removeFavoriteSchema
  },
  {
    method: "post",
    path: "/api/user/change-city",
    summary: "Change the current user's city",
    tags: ["User"],
    security: ["clerkAndApiSecret"],
    body: changeCitySchema
  }
];
