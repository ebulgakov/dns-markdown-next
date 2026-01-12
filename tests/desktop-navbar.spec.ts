import { test, expect, type Page } from "@playwright/test";

import { authUser } from "@/tests/helpers/auth-user";

test.use({ viewport: { width: 1280, height: 720 } });

test.describe("Desktop Navbar", () => {
  const getNavbar = (page: Page) => page.getByTestId("desktop-navbar-user");

  test("should display navbar links on Desktop", async ({ page }) => {
    await page.goto("/");

    const catalogLink = getNavbar(page).getByRole("link", { name: "Прайслист" });
    const archiveLink = getNavbar(page).getByRole("link", { name: "Архив" });
    const updatesLink = getNavbar(page).getByRole("link", { name: "Обновления" });

    await expect(catalogLink).toBeVisible();
    await expect(archiveLink).toBeVisible();
    await expect(updatesLink).toBeVisible();
  });

  test("should display navbar auth buttons on Desktop", async ({ page }) => {
    await page.goto("/");

    const signInLink = getNavbar(page).getByRole("button", { name: "Войти" });
    const signUpLink = getNavbar(page).getByRole("button", { name: "Зарегистрироваться" });

    await expect(signInLink).toBeVisible();
    await expect(signUpLink).toBeVisible();
  });

  test("should not display mobile menu button on Desktop", async ({ page }) => {
    await page.goto("/");

    const menuButton = getNavbar(page).getByLabel("Меню");
    await expect(menuButton).not.toBeVisible();
  });

  test("should display user links when signed in on Desktop", async ({ page }) => {
    await authUser(page);

    await page.goto("/");

    const profileLink = getNavbar(page).getByRole("link", { name: "Профиль" });
    const favoritesLink = getNavbar(page).getByRole("link", { name: "Избранное" });
    const avatar = getNavbar(page).getByTestId("user-avatar");

    await expect(profileLink).toBeVisible();
    await expect(favoritesLink).toBeVisible();
    await expect(avatar).toBeVisible();
  });
});
