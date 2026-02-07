import { ProductCardDiff } from "./product-card-diff";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ProductCardDiff> = {
  title: "Components/PriceList/ProductCardDiff",
  component: ProductCardDiff,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    diff: {
      price: "90000",
      priceOld: "100000",
      profit: "10000"
    }
  }
};

export const NoOldPrice: Story = {
  args: {
    diff: {
      price: "120000",
      priceOld: "",
      profit: "120000"
    }
  }
};

export const NoProfit: Story = {
  args: {
    diff: {
      price: "120000",
      priceOld: "140000",
      profit: ""
    }
  }
};
