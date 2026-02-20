import { JumpToSectionToggle } from "./jump-to-section-toggle";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof JumpToSectionToggle> = {
  title: "Components/JumpToSection/JumpToSectionToggle",
  component: JumpToSectionToggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof JumpToSectionToggle>;

export const Default: Story = {
  args: {
    isActive: false
  }
};

export const Active: Story = {
  args: {
    isActive: true
  }
};
