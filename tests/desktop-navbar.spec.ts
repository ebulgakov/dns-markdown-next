import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 720 } });

test.describe("Desktop Navbar", () => {
  test("should display navbar links on Desktop", async ({ page }) => {
    await page.goto("/");

    const catalogLink = page.getByRole("link", { name: "Прайслист" });
    const archiveLink = page.getByRole("link", { name: "Архив" });
    const updatesLink = page.getByRole("link", { name: "Обновления" });

    await expect(catalogLink).toBeVisible();
    await expect(archiveLink).toBeVisible();
    await expect(updatesLink).toBeVisible();
  });

  test("should display navbar auth buttons on Desktop", async ({ page }) => {
    await page.goto("/");

    const signInLink = page.getByRole("button", { name: "Войти" });
    const signUpLink = page.getByRole("button", { name: "Зарегистрироваться" });

    await expect(signInLink).toBeVisible();
    await expect(signUpLink).toBeVisible();
  });

  test("should not display mobile menu button on Desktop", async ({ page }) => {
    const menuButton = page.getByLabel("Меню");
    await expect(menuButton).toHaveCount(0);
  });
});
