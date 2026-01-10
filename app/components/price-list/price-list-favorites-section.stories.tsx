import { mockFavorites } from "./__mocks__/favorites";
import { mockPositions } from "./__mocks__/goods";
import { PriceListFavoritesSection } from "./price-list-favorites-section";

import type { Position } from "@/types/pricelist";
import type { Favorite, UserSections } from "@/types/user";
import type { Meta, StoryObj } from "@storybook/react";


const meta: Meta<typeof PriceListFavoritesSection> = {
  title: "Components/PriceList/PriceListFavoritesSection",
  component: PriceListFavoritesSection,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof PriceListFavoritesSection>;

const mockFavoriteSections: Position[] = mockPositions;

const mockUserFavoritesGoods: Favorite[] = mockFavorites;

const mockHiddenSectionsTitles: UserSections = ["Смартфоны"];

export const Default: Story = {
  args: {
    favoriteSections: mockFavoriteSections,
    userFavoritesGoods: mockUserFavoritesGoods,
    hiddenSectionsTitles: mockHiddenSectionsTitles
  }
};

export const NoFavorites: Story = {
  args: {
    favoriteSections: [],
    userFavoritesGoods: [],
    hiddenSectionsTitles: []
  }
};
