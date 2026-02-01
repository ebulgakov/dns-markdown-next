import { mockFavorites } from "./__mocks__/favorites";
import { mockGoodsList } from "./__mocks__/goods";
import { PriceListGoods } from "./price-list-goods";

import type { Diff as DiffType } from "@/types/analysis-diff";
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

const mockDiff: DiffType = {
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
      updatedAt: new Date("2024-06-01T10:00:00Z").toISOString(),
      createdAt: new Date("2024-05-25T10:00:00Z").toISOString(),
      deleted: true
    },
    favorites: mockFavorites
  }
};
