import type { Meta, StoryObj } from "@storybook/react";
import { PriceListFavoriteToggle } from "./price-list-favorite-toggle";
import { mockGoodsList } from "./__mocks__/goods";

const meta: Meta<typeof PriceListFavoriteToggle> = {
  component: PriceListFavoriteToggle,
  title: "Components/PriceList/PriceListFavoriteToggle",
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story, { args }) => {
      return <Story args={args} />;
    }
  ],
  args: {
    goods: mockGoodsList[0]
  }
};

export default meta;
type Story = StoryObj<typeof PriceListFavoriteToggle>;

export const Default: Story = {
  args: {
    favorites: []
  }
};

export const InFavorites: Story = {
  args: {
    favorites: [
      {
        item: mockGoodsList[1],
        id: "",
        status: {
          city: "",
          updatedAt: "",
          createdAt: "",
          deleted: false,
          updates: []
        }
      }
    ]
  }
};
