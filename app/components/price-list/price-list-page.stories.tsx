import {
  defaultContext,
  filledWithFavoritesContext,
  filledWithFavoritesSectionsContext,
  filledWithHiddenAndFavoritesSectionsContext,
  filledWithHiddenSectionsContext
} from "@/app/components/price-list/__mocks__/context";
import { UserProvider } from "@/app/contexts/user-context";

import { mockPriceList } from "./__mocks__/goods";
import { PriceListPage } from "./price-list-page";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PriceListPage> = {
  title: "Components/PriceList/PriceListPage",
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof PriceListPage>;

export const Default: Story = {
  render: args => (
    <UserProvider value={defaultContext}>
      <PriceListPage {...args} />
    </UserProvider>
  ),
  args: {
    priceList: mockPriceList
  }
};

export const WithFavorites: Story = {
  render: args => (
    <UserProvider value={filledWithFavoritesContext}>
      <PriceListPage {...args} />
    </UserProvider>
  ),
  args: {
    priceList: mockPriceList
  }
};

export const WithFavoritesSections: Story = {
  render: args => (
    <UserProvider value={filledWithFavoritesSectionsContext}>
      <PriceListPage {...args} />
    </UserProvider>
  ),
  args: {
    priceList: mockPriceList
  }
};

export const WithHiddenSections: Story = {
  render: args => (
    <UserProvider value={filledWithHiddenSectionsContext}>
      <PriceListPage {...args} />
    </UserProvider>
  ),
  args: {
    priceList: mockPriceList
  }
};

export const WithFavoritesAndHiddenSections: Story = {
  render: args => (
    <UserProvider value={filledWithHiddenAndFavoritesSectionsContext}>
      <PriceListPage {...args} />
    </UserProvider>
  ),
  args: {
    priceList: mockPriceList
  }
};
