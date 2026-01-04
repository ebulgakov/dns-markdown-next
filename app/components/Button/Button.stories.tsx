import type { Meta, StoryObj } from "@storybook/react";

import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "primary"]
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"]
    },
    disabled: {
      control: "boolean"
    },
    children: {
      control: "text"
    }
  },
  args: {
    children: "Button",
    variant: "default",
    size: "medium",
    disabled: false
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Click me",
    variant: "default",
    size: "medium"
  },
  argTypes: {
    disabled: { control: "boolean" }
  }
};

export const Primary: Story = {
  args: {
    children: "Primary button",
    variant: "primary"
  }
};

export const Large: Story = {
  args: {
    children: "Large button",
    size: "large"
  }
};

export const Small: Story = {
  args: {
    children: "Small button",
    size: "small"
  }
};
