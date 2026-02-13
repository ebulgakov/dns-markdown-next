import { test, expect } from "@playwright/test";

import { authUser } from "@/playwright/helpers/auth-user";

import type { Page } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 } });

test.describe("Mobile Navbar", () => {
  const getDialog = (page: Page) => page.getByTestId("mobile-navbar-user");

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(getDialog(page)).toHaveCount(0); // Initially, the dialog should not be visible

    const menuButton = page.getByLabel("Меню");
    await menuButton.click();
  });

  test("should open mobile navbar dialog on menu button click", async ({ page }) => {
    await expect(getDialog(page)).toHaveCount(1);
  });

  test("should display navbar links", async ({ page }) => {
    const catalogLink = getDialog(page).getByRole("link", { name: "Прайслист" });
    const archiveLink = getDialog(page).getByRole("link", { name: "Архив" });
    const updatesLink = getDialog(page).getByRole("link", { name: "Обновления" });
    const aboutLink = getDialog(page).getByRole("link", { name: "О сервисе" });

    await expect(catalogLink).toBeVisible();
    await expect(archiveLink).toBeVisible();
    await expect(updatesLink).toBeVisible();
    await expect(aboutLink).toBeVisible();
  });

  test("should display navbar auth buttons", async ({ page }) => {
    const signInLink = getDialog(page).getByRole("button", { name: "Войти" });
    const signUpLink = getDialog(page).getByRole("button", { name: "Зарегистрироваться" });

    await expect(signInLink).toBeVisible();
    await expect(signUpLink).toBeVisible();
  });

  test("should display user links when signed in", async ({ page, context }) => {
    await authUser(page, context);

    const menuButton = page.getByLabel("Меню");
    await menuButton.click();

    const profileLink = getDialog(page).getByRole("link", { name: "Профиль" });
    const favoritesLink = getDialog(page).getByRole("link", { name: "Избранное" });
    const signOutLink = getDialog(page).getByRole("button", { name: "Выйти" });

    await expect(profileLink).toBeVisible();
    await expect(favoritesLink).toBeVisible();
    await expect(signOutLink).toBeVisible();
  });
});
