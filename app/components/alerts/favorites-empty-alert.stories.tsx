import { FavoritesEmptyAlert } from "./favorites-empty-alert";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof FavoritesEmptyAlert> = {
  title: "Components/Alerts/FavoritesEmptyAlert",
  component: FavoritesEmptyAlert,
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
type Story = StoryObj<typeof FavoritesEmptyAlert>;

export const Default: Story = {};
