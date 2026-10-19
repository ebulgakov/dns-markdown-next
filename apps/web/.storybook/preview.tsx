import { ClerkProvider } from "@clerk/nextjs";
import { webApiHandlers } from "@dns-markdown/tests/msw";
import { withThemeByClassName } from "@storybook/addon-themes";
import { setupWorker } from "msw/browser";
import { mswLoader } from "msw-storybook-addon/csf3";

import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

const preview: Preview = {
  // MSW mocks the app's own `/api/*` routes for client components; `webApiHandlers` are the
  // defaults, a story overrides them with `parameters.msw`.
  loaders: [
    mswLoader(async () => {
      const worker = setupWorker(...webApiHandlers);
      await worker.start({ onUnhandledRequest: "bypass", quiet: true });
      return worker;
    })
  ],
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
