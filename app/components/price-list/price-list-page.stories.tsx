import { mockPriceList, mockPositions } from "./__mocks__/goods";
import { PriceListPage } from "./price-list-page";

import type { Position } from "@/types/pricelist";
import type { Favorite, UserSections } from "@/types/user";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PriceListPage> = {
  title: "Components/PriceList/PriceListPage",
  component: PriceListPage,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof PriceListPage>;

const mockFavoriteSections: UserSections = [mockPositions[0].title];

const mockUserFavoritesGoods: Favorite[] = [];

const mockHiddenSectionsTitles: UserSections = [mockPriceList.positions[1].title];

const nonFavoriteSections = mockPriceList.positions.filter(p => p.title !== mockPositions[0].title);

export const Default: Story = {
  args: {
    priceList: mockPriceList
  }
};

export const WithFavorites: Story = {
  args: {
    priceList: mockPriceList,
    isUserLoggedIn: true,
    favoriteSections: mockFavoriteSections,
    userFavorites: mockUserFavoritesGoods
  }
};

export const WithHiddenSections: Story = {
  args: {
    priceList: mockPriceList,
    isUserLoggedIn: true,
    favoriteSections: [],
    hiddenSections: mockHiddenSectionsTitles
  }
};

export const WithFavoritesAndHiddenSections: Story = {
  args: {
    priceList: mockPriceList,
    isUserLoggedIn: true,
    favoriteSections: mockFavoriteSections,
    userFavorites: mockUserFavoritesGoods,
    hiddenSections: mockHiddenSectionsTitles
  }
};
