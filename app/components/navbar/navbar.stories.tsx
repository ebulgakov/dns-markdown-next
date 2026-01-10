import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import React from "react";

import messages from "@/i18n/locates/ru.json";

import { Navbar } from "./navbar";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Navbar> = {
  title: "Components/Navbar",
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
