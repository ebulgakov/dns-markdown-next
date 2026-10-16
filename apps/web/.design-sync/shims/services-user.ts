// design-sync bundle shim for @/services/user — see NOTES.md.
// Same rationale as services-post.ts: "use server" module, action
// side-effects never exercised by a static preview render.
export const postAddToFavoriteSections = async () => null;
export const postAddToHiddenSections = async () => null;
export const postRemoveFromFavoriteSection = async () => null;
export const postRemoveFromHiddenSections = async () => null;
