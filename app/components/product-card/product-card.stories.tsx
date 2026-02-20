import { defaultContext } from "@/app/components/product-card/__mocks__/context";
import { UserProvider } from "@/app/contexts/user-context";

import { mockDiff, mockGoodsList } from "./__mocks__/goods";
import { ProductCard } from "./product-card";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ProductCard> = {
  title: "Components/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  argTypes: {
    item: { control: "object" },
    status: { control: "object" }
  }
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  render: args => (
    <UserProvider value={defaultContext}>
      <ProductCard {...args} />
    </UserProvider>
  ),
  args: {
    item: mockGoodsList[0]
  }
};

export const WithStar: Story = {
  render: args => (
    <UserProvider value={defaultContext}>
      <ProductCard {...args} />
    </UserProvider>
  ),
  args: {
    item: mockGoodsList[0],
    shownFavorites: true
  }
};

export const WithDiff: Story = {
  render: args => (
    <UserProvider value={defaultContext}>
      <ProductCard {...args} />
    </UserProvider>
  ),
  args: {
    diff: mockDiff,
    item: mockGoodsList[0],
    shownFavorites: true
  }
};

export const WithStatus: Story = {
  args: {
    item: mockGoodsList[0],
    status: {
      city: "TestCity",
      updatedAt: new Date("2024-06-01T10:00:00Z").toISOString(),
      createdAt: new Date("2024-05-25T10:00:00Z").toISOString(),
      deleted: true
    }
  }
};
