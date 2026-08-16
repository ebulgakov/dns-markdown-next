import {
  filledWithFavoritesContext,
  defaultContext
} from "@/entities/product/ui/__mocks__/context";
import { mockGoodsList } from "@/entities/product/ui/__mocks__/goods";
import { UserProvider } from "@/entities/user";

import { ProductCardFavoriteToggle } from "./product-card-favorite-toggle";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ProductCardFavoriteToggle> = {
  component: ProductCardFavoriteToggle,
  title: "Components/ProductCard/ProductCardFavoriteToggle",
  parameters: {
    layout: "centered"
  },
  args: {
    goods: mockGoodsList[0]
  }
};

export default meta;
type Story = StoryObj<typeof ProductCardFavoriteToggle>;

export const Default: Story = {
  render: args => (
    <UserProvider value={defaultContext}>
      <ProductCardFavoriteToggle {...args} />
    </UserProvider>
  )
};

export const InFavorites: Story = {
  render: args => (
    <UserProvider value={filledWithFavoritesContext}>
      <ProductCardFavoriteToggle {...args} />
    </UserProvider>
  )
};
