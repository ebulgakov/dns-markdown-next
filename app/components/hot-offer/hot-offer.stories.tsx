import { mockGoodsList } from "@/app/components/price-list/__mocks__/goods";

import { HotOffer } from "./hot-offer";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/HotOffer",
  component: HotOffer,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof HotOffer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    goods: mockGoodsList[0]
  }
};
