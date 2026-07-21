// design-sync bundle shim for @/services/post — see NOTES.md.
// The real module is a "use server" Server Action file: Next's compiler
// normally strips it to a client-side call reference, which raw esbuild
// can't replicate (it pulls in real @clerk/nextjs/server + Node builtins).
// These actions are event-handler side effects never exercised by a static
// preview render, so inert no-ops are functionally equivalent here.
export const postUpdateUserNotifications = async () => null;
export const postAddToFavorites = async () => null;
export const postAddToFavoriteSections = async () => null;
export const postAddToHiddenSections = async () => null;
export const postRemoveFromFavorites = async () => null;
export const postRemoveFromFavoriteSection = async () => null;
export const postRemoveFromHiddenSections = async () => null;
