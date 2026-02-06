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
  args: {
    position: mockPosition
  }
};

export const WithFavorites: Story = {
  args: {
    ...Default.args
  }
};

export const WithDiffs: Story = {
  args: {
    ...Default.args,
    diffs: { "1": mockDiff }
  }
};

export const Closed: Story = {
  args: {
    ...Default.args
  }
};
