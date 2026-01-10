import { Label } from "./label";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Your email address",
    htmlFor: "email"
  }
};
