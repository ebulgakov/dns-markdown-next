import { getFirstGoods } from "@/playwright/helpers/getters";

import type { Page } from "@playwright/test";

export const removeFromFavoritesFirstGoods = async (page: Page) => {
  const removeFromFavoriteBtn = getFirstGoods(page).getByTestId("remove-from-favorites");
  await removeFromFavoriteBtn.click();
  await page.waitForLoadState("networkidle");
};

export const addToFavoritesFirstGoods = async (page: Page) => {
  const addToFavoriteBtn = getFirstGoods(page).getByTestId("add-to-favorites").first();
  await addToFavoriteBtn.click();
  await page.waitForLoadState("networkidle");
};

export const clickToFavoritesLink = async (page: Page) => {
  const favoritesLink = page.getByRole("link", { name: "Избранное" });
  await favoritesLink.click();
  await page.waitForLoadState("networkidle");
};

export const clickToCatalogLink = async (page: Page) => {
  const catalogLink = page.getByRole("link", { name: "Прайслист" });
  await catalogLink.click();
  await page.waitForLoadState("networkidle");
};
