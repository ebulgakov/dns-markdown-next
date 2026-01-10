import { Label } from "@/app/components/ui/label";

import { Checkbox } from "./checkbox";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: args => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
};

export const Disabled: Story = {
  render: args => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-disabled" disabled {...args} />
      <Label htmlFor="terms-disabled">Accept terms and conditions</Label>
    </div>
  )
};
