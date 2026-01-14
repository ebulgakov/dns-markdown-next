import { FavoritesEmpty } from "./favorites-empty";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof FavoritesEmpty> = {
  title: "Components/Favorites/FavoritesEmpty",
  component: FavoritesEmpty,
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
type Story = StoryObj<typeof FavoritesEmpty>;

export const Default: Story = {};
