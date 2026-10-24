import { DefaultTheme } from "expo-router";
import type { Theme } from "expo-router";

import { COLORS } from "@/theme/colors";

const NAV_THEME: { light: Theme; dark: Theme } = {
  light: {
    dark: false,
    colors: {
      primary: COLORS.light.primary,
      background: COLORS.light.background,
      card: COLORS.light.card,
      text: COLORS.light.foreground,
      border: COLORS.light.border,
      notification: COLORS.light.destructive
    },
    fonts: DefaultTheme.fonts
  },
  dark: {
    dark: true,
    colors: {
      primary: COLORS.dark.primary,
      background: COLORS.dark.background,
      card: COLORS.dark.card,
      text: COLORS.dark.foreground,
      border: COLORS.dark.border,
      notification: COLORS.dark.destructive
    },
    fonts: DefaultTheme.fonts
  }
};

export { NAV_THEME };
