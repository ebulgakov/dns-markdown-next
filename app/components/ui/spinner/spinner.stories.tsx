import { Spinner } from "./spinner";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const Large: Story = {
  args: {
    className: "size-8"
  }
};
