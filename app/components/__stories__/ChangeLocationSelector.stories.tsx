import { Meta, StoryObj } from "@storybook/react";
import ChangeLocationSelector from "../ChangeLocationSelector";

const meta: Meta<typeof ChangeLocationSelector> = {
  title: "Components/ChangeLocationSelector",
  component: ChangeLocationSelector,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ChangeLocationSelector>;

export const Default: Story = {
  args: {}
};

export const Russian: Story = {
  args: {
    locate: "ru"
  }
};

export const English: Story = {
  args: {
    locate: "en"
  }
};
