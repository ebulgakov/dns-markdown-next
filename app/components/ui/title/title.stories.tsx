import type { Meta, StoryObj } from "@storybook/react";
import { Title } from "./title";

const meta = {
  title: "UI/Title",
  component: Title,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text" },
    variant: { control: "radio", options: ["h2", "h3"] }
  }
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is a Default Title (H2)"
  }
};

export const H2: Story = {
  args: {
    variant: "h2",
    children: "This is a H2 Title"
  }
};

export const H3: Story = {
  args: {
    variant: "h3",
    children: "This is a H3 Title"
  }
};
