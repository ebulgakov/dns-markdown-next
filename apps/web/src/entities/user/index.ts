// Public API. `./api/user` and `./api/guest` stay private — only `./api/post`
// (the guest/user-branching layer) is exposed; components/pages never
// special-case guest vs. logged-in user (see CLAUDE.md).
export {
  postUpdateUserNotifications,
  postToggleFavoriteShownBought,
  postAddToFavorites,
  postRemoveFromFavorites,
  postAddToHiddenSections,
  postRemoveFromHiddenSections,
  postAddToFavoriteSections,
  postRemoveFromFavoriteSection,
  postChangeUserCity,
  getUser,
  getPriceListCity
} from "./api/post";
export type { SectionsResponse } from "./api/post";

// getSessionInfo/getRealUser are the two documented direct-access exceptions
// to the guest/user branching in ./api/post (see CLAUDE.md): a handful of
// routes need the raw Clerk session or explicitly the logged-in user, not
// the guest-aware getUser above. `getRealUser` renames api/user's `getUser`
// to avoid colliding with post.ts's branching `getUser`.
export { getSessionInfo, getUser as getRealUser } from "./api/user";

export { UserProvider, UserContext } from "./model/user-context";
export type { User, Favorite, FavoriteStatus, UserSections, UserNotifications } from "./model/user";
