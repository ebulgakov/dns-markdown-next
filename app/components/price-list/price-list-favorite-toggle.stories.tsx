import { mockGoodsList } from "@/app/components/price-list/__mocks__/goods";
import { UserProvider } from "@/app/contexts/user-context";

import { filledWithFavoritesContext, defaultContext } from "./__mocks__/context";
import { PriceListFavoriteToggle } from "./price-list-favorite-toggle";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PriceListFavoriteToggle> = {
  component: PriceListFavoriteToggle,
  title: "Components/PriceList/PriceListFavoriteToggle",
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  args: {
    goods: mockGoodsList[0]
  }
};

export default meta;
type Story = StoryObj<typeof PriceListFavoriteToggle>;

export const Default: Story = {
  render: args => (
    <UserProvider value={defaultContext}>
      <PriceListFavoriteToggle {...args} />
    </UserProvider>
  )
};

export const InFavorites: Story = {
  render: args => (
    <UserProvider value={filledWithFavoritesContext}>
      <PriceListFavoriteToggle {...args} />
    </UserProvider>
  )
};
