import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, delay, http } from "msw";
import { useState } from "react";

import { defaultContext } from "@/entities/product/ui/__mocks__/context";
import { UserProvider } from "@/entities/user";

import { TodayClientPage } from "./today-client-page";

import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

// A fresh client per story (no cache shared between stories) without retries, so an error
// response shows the error state at once instead of after TanStack Query's retry backoff.
function StoryQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } })
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

// `/api/today-diff` is served by MSW: the default response comes from `webApiHandlers`
// (@dns-markdown/tests/msw, registered in .storybook/preview.tsx), stories override it with
// `parameters.msw`.
const meta: Meta<typeof TodayClientPage> = {
  title: "Pages/Today/TodayClientPage",
  component: TodayClientPage,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    Story => (
      <StoryQueryProvider>
        <UserProvider value={defaultContext}>
          <div style={{ minHeight: "100vh" }}>
            <Story />
          </div>
        </UserProvider>
      </StoryQueryProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof TodayClientPage>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await canvas.findByText(/Обновления на/);
  }
};

export const Loading: Story = {
  parameters: {
    msw: [
      http.get("/api/today-diff", async () => {
        await delay("infinite");
        return HttpResponse.json({});
      })
    ]
  }
};

export const LoadError: Story = {
  parameters: {
    msw: [
      http.get("/api/today-diff", () =>
        HttpResponse.json({ message: "Internal server error" }, { status: 500 })
      )
    ]
  },
  play: async ({ canvas }) => {
    await canvas.findByText("Ошибка загрузки каталога");
  }
};
