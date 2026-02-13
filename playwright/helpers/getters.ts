import type { Page } from "@playwright/test";

export const getDesktopNavbar = (page: Page) => page.getByTestId("desktop-navbar-user");
export const getFirstGoods = (page: Page) => page.getByTestId("pricelist-goods").first();
