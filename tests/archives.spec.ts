import { test } from "@playwright/test";

test.describe("Archives", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/archive");
  });

  test("should archives list be shown", async ({ page }) => {
    const archiveItemsLocator = page.getByTestId("archive-list-item-link");
    const itemCount = await archiveItemsLocator.count();
    test.expect(itemCount).toBeGreaterThan(0);
  });

  test("should archive items page be shown", async ({ page }) => {
    const firstArchiveItem = page.getByTestId("archive-list-item-link").first();
    await firstArchiveItem.click();
    await page.waitForLoadState("networkidle");

    const productsCountLocator = page.getByTestId("archive-price-list-count");
    const productsCountText = await productsCountLocator.textContent();
    const productsCount = Number(productsCountText);
    test.expect(productsCount).toBeGreaterThan(0);

    const archivePriceListItem = page.getByTestId("price-list-page");
    await test.expect(archivePriceListItem).toBeVisible();
  });
});
