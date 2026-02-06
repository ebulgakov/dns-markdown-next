import {
  defaultContext,
  filledWithFavoritesContext
} from "@/app/components/price-list/__mocks__/context";
import { UserProvider } from "@/app/contexts/user-context";

import { mockDiff, mockGoodsList } from "./__mocks__/goods";
import { PriceListSection } from "./price-list-section";

import type { Position } from "@/types/pricelist";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PriceListSection> = {
  title: "Components/PriceList/PriceListSection",
  component: PriceListSection,
  tags: ["autodocs"],
  argTypes: {
    position: { control: "object" },
    diffs: { control: "object" }
  }
};

export default meta;
type Story = StoryObj<typeof PriceListSection>;

const mockGoods1 = mockGoodsList[0];

const mockGoods2 = mockGoodsList[1];

const mockPosition: Position = {
  _id: "pos1",
  title: "Apple",
  items: [mockGoods1, mockGoods2]
};

export const Default: Story = {
  render: args => (
    <UserProvider value={defaultContext}>
      <PriceListSection {...args} />
    </UserProvider>
  ),
  args: {
    position: mockPosition
  }
};

export const WithFavorites: Story = {
  render: args => (
    <UserProvider value={filledWithFavoritesContext}>
      <PriceListSection {...args} />
    </UserProvider>
  ),
  args: {
    ...Default.args,
    shownHeart: true
  }
};

export const WithDiffs: Story = {
  render: args => (
    <UserProvider value={defaultContext}>
      <PriceListSection {...args} />
    </UserProvider>
  ),
  args: {
    ...Default.args,
    diffs: { g1: mockDiff, g3: mockDiff }
  }
};

export const WithOuterHiddenSections: Story = {
  render: args => (
    <UserProvider value={defaultContext}>
      <PriceListSection {...args} />
    </UserProvider>
  ),
  args: {
    ...Default.args,
    outerHiddenSections: ["Apple"]
  }
};
