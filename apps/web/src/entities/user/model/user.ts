// Favorite/FavoriteStatus are owned by entities/product (a favorite embeds
// a full Goods object; the metadata itself has no user-specific fields) —
// re-exported here so consumers of @/entities/user keep working unchanged.
export type { Favorite, FavoriteStatus } from "@/entities/product";

export type { User, UserNotifications, UserSections } from "@dns-markdown/types/user";
