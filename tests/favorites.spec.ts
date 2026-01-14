import { test, expect, type Page } from "@playwright/test";

import { addToFavoritesFirstGoods, removeFromFavoritesFirstGoods } from "@/tests/helpers/actions";
import { authUser } from "@/tests/helpers/auth-user";
import { getDesktopNavbar } from "@/tests/helpers/getters";

test.use({ viewport: { width: 1280, height: 720 } });

test.describe("Favorites", () => {
  const visitFavoritesPage = async (page: Page) => {
    const favoritesLink = getDesktopNavbar(page).getByRole("link", { name: "Избранное" });
    await favoritesLink.click();
    await page.waitForLoadState("networkidle"); // Wait for the page to fully load
  };

  const addGoodsToFavorites = async (page: Page) => {
    const catalogLink = getDesktopNavbar(page).getByRole("link", { name: "Прайслист" });
    await catalogLink.click();
    await removeFromFavoritesFirstGoods(page);
    await addToFavoritesFirstGoods(page);
  };

  const removeGoodsFromFavorites = async (page: Page) => {
    const catalogLink = getDesktopNavbar(page).getByRole("link", { name: "Прайслист" });
    await catalogLink.click();
    await addToFavoritesFirstGoods(page);
    await removeFromFavoritesFirstGoods(page);
  };

  test("should add and remove favorite from the collection", async ({ page }) => {
    await authUser(page);

    await addGoodsToFavorites(page);
    await visitFavoritesPage(page);

    const favoriteItems = page.getByTestId("pricelist-goods");
    const itemCount = await favoriteItems.count();
    expect(itemCount).toBeGreaterThan(0);

    await removeGoodsFromFavorites(page);
    await visitFavoritesPage(page);

    const noFavoritesMessage = page.getByTestId("favorites-empty-message");
    await expect(noFavoritesMessage).toBeVisible();
  });
});
