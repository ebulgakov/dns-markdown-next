import { mockFavorites } from "./__mocks__/favorites";
import { mockGoodsList } from "./__mocks__/goods";
import { PriceListGoods } from "./price-list-goods";

import type { GoodDiffChanges as GoodDiffChangesType } from "@/types/diff";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PriceListGoods> = {
  title: "Components/PriceList/PriceListGoods",
  component: PriceListGoods,
  tags: ["autodocs"],
  argTypes: {
    item: { control: "object" },
    diff: { control: "object" },
    favorites: { control: "object" },
    status: { control: "object" }
  }
};

export default meta;
type Story = StoryObj<typeof PriceListGoods>;

const mockDiff: GoodDiffChangesType = {
  price: "19999",
  priceOld: "21999",
  profit: "2000"
};

export const Default: Story = {
  args: {
    item: mockGoodsList[0],
    favorites: mockFavorites
  }
};

export const AuthUser: Story = {
  args: {
    item: mockGoodsList[0],
    isUserLoggedIn: true,
    favorites: mockFavorites
  }
};

export const WithDiff: Story = {
  args: {
    item: mockGoodsList[0],
    diff: mockDiff,
    favorites: mockFavorites
  }
};

export const Bought: Story = {
  args: {
    item: mockGoodsList[0],
    status: {
      updatedAt: new Date().toISOString(),
      city: "",
      createdAt: new Date().toISOString(),
      deleted: true,
      updates: []
    },
    favorites: mockFavorites
  }
};
