import { test, expect } from "@playwright/test";

import {
  addToFavoritesFirstGoods,
  clickToCatalogLink,
  clickToFavoritesLink,
  removeFromFavoritesFirstGoods
} from "@/playwright/helpers/actions";
import { authUser } from "@/playwright/helpers/auth-user";

test.use({ viewport: { width: 1280, height: 720 } });

test.describe("Favorites", () => {
  test.beforeEach(async ({ page, context }) => {
    await authUser(page, context);
  });

  test("should display empty state when no favorites", async ({ page }) => {
    await clickToFavoritesLink(page);
    const noFavoritesMessage = page.getByTestId("favorites-empty-message");
    await expect(noFavoritesMessage).toBeVisible();
  });

  test("should add favorite from the collection and remove from favorites", async ({ page }) => {
    await clickToCatalogLink(page);
    await addToFavoritesFirstGoods(page);
    await clickToFavoritesLink(page);

    const favoritePageLocator = page.getByTestId("favorites-page");
    await expect(favoritePageLocator).toBeVisible();

    const favoriteItems = favoritePageLocator.getByTestId("pricelist-goods");
    const itemCount = await favoriteItems.count();
    expect(itemCount).toBeGreaterThan(0);

    await removeFromFavoritesFirstGoods(page);
    await page.reload();

    const noFavoritesMessage = page.getByTestId("favorites-empty-message");
    await expect(noFavoritesMessage).toBeVisible();
  });
});
