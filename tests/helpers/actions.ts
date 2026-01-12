import { getFirstGoods } from "@/tests/helpers/getters";

import type { Page } from "@playwright/test";

export const removeFromFavoritesFirstGoods = async (page: Page) => {
  const removeFromFavoriteBtn = getFirstGoods(page).getByTestId("remove-from-favorites");
  if (await removeFromFavoriteBtn.isVisible()) await removeFromFavoriteBtn.click();
  await page.waitForLoadState("networkidle");
};

export const addToFavoritesFirstGoods = async (page: Page) => {
  const addToFavoriteBtn = getFirstGoods(page).getByTestId("add-to-favorites").first();
  if (await addToFavoriteBtn.isVisible()) await addToFavoriteBtn.click();
  await page.waitForLoadState("networkidle");
};
