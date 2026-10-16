import { Router } from "express";

import changeCityHandler from "./change-city";
import addFavoriteHandler from "./favorite-add";
import removeFavoriteHandler from "./favorite-remove";
import favoriteSectionAddHandler from "./favorite-section-add";
import favoriteSectionRemoveHandler from "./favorite-section-remove";
import hiddenSectionAddHandler from "./hidden-section-add";
import hiddenSectionRemoveHandler from "./hidden-section-remove";
import updateNotificationHandler from "./notifications-update";
import toggleShownBoughtFavoritesHandler from "./toggle-shown-bought-favorites";
import userByIdHandler from "./user";

const router = Router();

router.post("/", userByIdHandler);
router.post("/notifications-update", updateNotificationHandler);
router.post("/toggle-shown-bought-favorites", toggleShownBoughtFavoritesHandler);
router.post("/hidden-section-add", hiddenSectionAddHandler);
router.post("/hidden-section-remove", hiddenSectionRemoveHandler);
router.post("/favorite-section-add", favoriteSectionAddHandler);
router.post("/favorite-section-remove", favoriteSectionRemoveHandler);
router.post("/favorite-add", addFavoriteHandler);
router.post("/favorite-remove", removeFavoriteHandler);
router.post("/change-city", changeCityHandler);

export default router;
