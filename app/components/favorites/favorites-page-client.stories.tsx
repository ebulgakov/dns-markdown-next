import { mockFavorites } from "./__mocks__/favories";
import { FavoritesPageClient } from "./favorites-page-client";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof FavoritesPageClient> = {
  title: "Components/Favorites/FavoritesPageClient",
  component: FavoritesPageClient,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  argTypes: {
    favorites: { control: "object" },
    shownBoughtFavorites: { control: "boolean" }
  }
};

export default meta;
type Story = StoryObj<typeof FavoritesPageClient>;

export const Default: Story = {
  args: {
    favorites: mockFavorites,
    shownBoughtFavorites: false
  }
};

export const WithBoughtItemsShown: Story = {
  args: {
    favorites: mockFavorites,
    shownBoughtFavorites: true
  }
};

export const Empty: Story = {
  args: {
    favorites: [],
    shownBoughtFavorites: false
  }
};
