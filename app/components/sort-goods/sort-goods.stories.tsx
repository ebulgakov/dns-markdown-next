import type { Meta, StoryObj } from "@storybook/react";
import { SortGoods } from "./sort-goods";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";

const meta: Meta<typeof SortGoods> = {
  title: "Components/SortGoods",
  component: SortGoods,
  parameters: {
    layout: "centered"
  },
  decorators: [
    Story => {
      // Reset store before each story
      useSortGoodsStore.setState({
        sortGoods: "default",
        updateSortGoods: sort => useSortGoodsStore.setState({ sortGoods: sort })
      });
      return <Story />;
    }
  ]
};

export default meta;
type Story = StoryObj<typeof SortGoods>;

export const Default: Story = {
  name: "Default state",
  play: async ({ canvas, userEvent }) => {
    const trigger = await canvas.findByRole("combobox");
    await userEvent.click(trigger);
  }
};
