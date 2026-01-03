import type { Meta, StoryObj } from "@storybook/react";
import Navbar from "../Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

const meta: Meta<typeof Navbar> = {
  title: "UI/Navbar",
  component: Navbar,
  decorators: [
    Story => (
      <ClerkProvider>
        <Story />
      </ClerkProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};
