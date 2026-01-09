import type { Meta, StoryObj } from "@storybook/react";
import { PriceListPage } from "./price-list-page";
import type { Position } from "@/types/pricelist";
import type { Favorite, UserSections } from "@/types/user";
import { mockPriceList } from "./__mocks__/goods";

const meta: Meta<typeof PriceListPage> = {
  title: "Components/PriceList/PriceListPage",
  component: PriceListPage,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof PriceListPage>;

const mockFavoriteSections: Position[] = [];

const mockUserFavoritesGoods: Favorite[] = [];

const mockHiddenSectionsTitles: UserSections = ["Section 2"];

const nonFavoriteSections = mockPriceList.positions.filter(p => p.title !== "Section 2");

export const Default: Story = {
  args: {
    priceList: mockPriceList
  }
};

export const WithFavorites: Story = {
  args: {
    priceList: mockPriceList,
    favoriteSections: mockFavoriteSections,
    userFavoritesGoods: mockUserFavoritesGoods
  }
};

export const WithHiddenSections: Story = {
  args: {
    priceList: mockPriceList,
    hiddenSectionsTitles: mockHiddenSectionsTitles,
    nonFavoriteSections: nonFavoriteSections
  }
};

export const WithFavoritesAndHiddenSections: Story = {
  args: {
    priceList: mockPriceList,
    favoriteSections: mockFavoriteSections,
    userFavoritesGoods: mockUserFavoritesGoods,
    hiddenSectionsTitles: mockHiddenSectionsTitles,
    nonFavoriteSections: nonFavoriteSections
  }
};
