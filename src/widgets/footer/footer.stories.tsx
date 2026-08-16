import { NextIntlClientProvider } from "next-intl";
import React from "react";

import messages from "@/i18n/locates/ru.json";

import { Footer } from "./footer";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    Story => (
      <NextIntlClientProvider locale="ru" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
