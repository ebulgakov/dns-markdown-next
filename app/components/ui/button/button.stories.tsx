import { PlusIcon } from "lucide-react";
import { fn } from "storybook/test";

import { Button } from "./button";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"]
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"]
    },
    asChild: {
      table: {
        disable: true
      }
    }
  },
  args: {
    onClick: fn(),
    children: "Button"
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const Destructive: Story = {
  args: {
    variant: "destructive"
  }
};

export const Outline: Story = {
  args: {
    variant: "outline"
  }
};

export const Secondary: Story = {
  args: {
    variant: "secondary"
  }
};

export const Ghost: Story = {
  args: {
    variant: "ghost"
  }
};

export const Link: Story = {
  args: {
    variant: "link"
  }
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <PlusIcon />
        Button
      </>
    )
  }
};

export const Icon: Story = {
  args: {
    size: "icon",
    children: <PlusIcon />
  }
};
