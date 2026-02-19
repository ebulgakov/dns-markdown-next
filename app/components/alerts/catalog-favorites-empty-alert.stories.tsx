import { CatalogFavoritesEmptyAlert } from "./catalog-favorites-empty-alert";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CatalogFavoritesEmptyAlert> = {
  title: "Components/Alerts/CatalogFavoritesEmptyAlert",
  component: CatalogFavoritesEmptyAlert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  }
};

export default meta;
type Story = StoryObj<typeof CatalogFavoritesEmptyAlert>;

export const Default: Story = {};
