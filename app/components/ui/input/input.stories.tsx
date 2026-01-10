import { Input } from "./input";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    inputSize: {
      options: ["sm", "md", "lg"],
      control: { type: "radio" }
    },
    disabled: {
      control: { type: "boolean" }
    },
    placeholder: {
      control: { type: "text" }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
    inputSize: "md",
    disabled: false
  }
};

export const Small: Story = {
  args: {
    ...Default.args,
    inputSize: "sm"
  }
};

export const Large: Story = {
  args: {
    ...Default.args,
    inputSize: "lg"
  }
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true
  }
};

export const Invalid: Story = {
  render: args => <Input {...args} aria-invalid />,
  args: {
    ...Default.args
  }
};
