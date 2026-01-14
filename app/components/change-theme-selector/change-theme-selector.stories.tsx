import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

import { ChangeThemeSelector } from "./change-theme-selector";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/ChangeThemeSelector",
  component: ChangeThemeSelector,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    Story => {
      const messages = {
        ChangeThemeSelector: {
          light: "light",
          dark: "dark"
        }
      };

      return (
        <ThemeProvider>
          <NextIntlClientProvider locale="ru" messages={messages}>
            <Story />
          </NextIntlClientProvider>
        </ThemeProvider>
      );
    }
  ]
} satisfies Meta<typeof ChangeThemeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
