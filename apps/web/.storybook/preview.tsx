import { ClerkProvider } from "@clerk/nextjs";
import { withThemeByClassName } from "@storybook/addon-themes";

import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
  decorators: [
    withThemeByClassName({
      defaultTheme: "light",
      themes: {
        light: "light",
        dark: "dark"
      },
      parentSelector: "html"
    }),
    (Story, { args }) => {
      return (
        <ClerkProvider>
          <Story args={args} />
        </ClerkProvider>
      );
    }
  ]
};

export default preview;
