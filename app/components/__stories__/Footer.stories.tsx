import type { Meta, StoryObj } from "@storybook/react";
import Footer from "../Footer";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/i18n/locates/ru.json";
import React from "react";

const meta: Meta<typeof Footer> = {
  title: "UI/Footer",
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
