import { test, expect, type Page } from "@playwright/test";

import { authUser } from "@/tests/helpers/auth-user";

test.use({ viewport: { width: 1280, height: 720 } });

test.describe("Desktop Favorites", () => {
  const getNavbar = (page: Page) => page.getByTestId("desktop-navbar-user");

  test("should add favorite to the collection", async ({ page }) => {
    await authUser(page);

    await page.goto("/favorites");

    const favoriteItems0 = page.getByTestId("pricelist-goods");
    const itemCount0 = await favoriteItems0.count();
    expect(itemCount0).toBeLessThanOrEqual(0);

    await page.goto("/");

    const catalogLink = getNavbar(page).getByRole("link", { name: "Прайслист" });

    await expect(catalogLink).toBeVisible();

    await catalogLink.click();

    const firstProduct = page.getByTestId("pricelist-goods").first();
    const getRemoveFromFavoriteButton = () =>
      firstProduct.getByTestId("remove-from-favorites").first();
    await expect(firstProduct).toBeVisible();

    const initialRemoveButton = getRemoveFromFavoriteButton();
    // If the item is already in favorites, remove it first
    if (await initialRemoveButton.isVisible()) await initialRemoveButton.click();
    await expect(initialRemoveButton).not.toBeVisible();

    const addToFavoriteButton = firstProduct.getByTestId("add-to-favorites").first();
    await expect(addToFavoriteButton).toBeVisible();
    await addToFavoriteButton.click();
    await expect(addToFavoriteButton).not.toBeVisible();

    const removeButton = getRemoveFromFavoriteButton();
    await expect(removeButton).toBeVisible();

    const favoritesLink = getNavbar(page).getByRole("link", { name: "Избранное" });

    await expect(favoritesLink).toBeVisible();

    await favoritesLink.click();

    const favoriteItems = page.getByTestId("pricelist-goods");
    const itemCount = await favoriteItems.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  // test("should remove favorite from the collection", async ({ page }) => {
  //   await authUser(page);
  //
  //   await page.goto("/favorites");
  //
  //   const favoriteItem = page.getByTestId("favorite-item").first();
  //   const removeButton = favoriteItem.getByTestId("remove-from-favorites");
  //
  //   await expect(removeButton).toBeVisible();
  //
  //   await removeButton.click();
  //
  //   await expect(favoriteItem).toHaveCount(0);
  // });
});
