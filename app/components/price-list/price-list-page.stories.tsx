import { mockPriceList } from "./__mocks__/goods";
import { PriceListPage } from "./price-list-page";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PriceListPage> = {
  title: "Components/PriceList/PriceListPage",
  component: PriceListPage,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof PriceListPage>;

export const Default: Story = {
  args: {
    priceList: mockPriceList
  }
};

export const WithFavorites: Story = {
  args: {
    priceList: mockPriceList
  }
};

export const WithHiddenSections: Story = {
  args: {
    priceList: mockPriceList
  }
};

export const WithFavoritesAndHiddenSections: Story = {
  args: {
    priceList: mockPriceList
  }
};
