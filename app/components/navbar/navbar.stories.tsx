import { NextIntlClientProvider } from "next-intl";
import React from "react";

import { defaultContext } from "@/app/components/product-card/__mocks__/context";
import { UserProvider } from "@/app/contexts/user-context";
import messages from "@/i18n/locates/ru.json";

import { Navbar } from "./navbar";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Navbar> = {
  title: "Components/Navbar",
  component: Navbar,
  parameters: {
    nextjs: {
      appDirectory: true
    }
  },
  decorators: [
    Story => (
      <NextIntlClientProvider locale="ru" messages={messages}>
        <UserProvider value={{ ...defaultContext, city: "samara" }}>
          <Story />
        </UserProvider>
      </NextIntlClientProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};
