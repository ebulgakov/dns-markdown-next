import type { Meta, StoryObj } from "@storybook/react";

import Button from "../Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Click me"
  }
};

export const IsActive: Story = {
  args: {
    children: "Active",
    isActive: true
  }
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true
  }
};
