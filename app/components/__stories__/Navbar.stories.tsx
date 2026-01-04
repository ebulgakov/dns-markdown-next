import type { Meta, StoryObj } from "@storybook/react";
import Navbar from "../Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/i18n/locates/ru.json";

const meta: Meta<typeof Navbar> = {
  title: "UI/Navbar",
  component: Navbar,
  decorators: [
    Story => (
      <NextIntlClientProvider locale="ru" messages={messages}>
        <ClerkProvider>
          <Story />
        </ClerkProvider>
      </NextIntlClientProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};
