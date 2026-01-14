import { PriceListFavoritesEmptyAlert } from "./price-list-favorites-empty-alert";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/PriceList/PriceListFavoritesEmptyAlert",
  component: PriceListFavoritesEmptyAlert,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof PriceListFavoritesEmptyAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    isUserLoggedIn: true
  }
};

export const LoggedOut: Story = {
  args: {
    isUserLoggedIn: false
  }
};
