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

export const DisabledDefault: Story = {
  args: {
    children: "Disabled",
    disabled: true
  }
};

export const Primary: Story = {
  args: {
    children: "Primary button",
    variant: "primary"
  }
};

export const DisabledPrimary: Story = {
  args: {
    children: "Disabled Primary button",
    variant: "primary",
    disabled: true
  }
};
