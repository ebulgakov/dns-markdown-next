import { Heart, ExternalLink, ChevronRight } from "lucide-react";

import { MoreLink } from "./more-link";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/MoreLink",
  component: MoreLink,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof MoreLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Показать ещё"
  }
};

export const WithCustomIcon: Story = {
  args: {
    icon: Heart,
    children: "Добавить в избранное"
  }
};

export const WithExternalLinkIcon: Story = {
  args: {
    icon: ExternalLink,
    children: "Перейти на сайт"
  }
};

export const WithChevronIcon: Story = {
  args: {
    icon: ChevronRight,
    children: "Далее"
  }
};
