import { useEffect } from "react";

import { usePriceListStore } from "@/entities/product";
import { defaultContext } from "@/entities/product/ui/__mocks__/context";
import { mockPriceList } from "@/entities/product/ui/__mocks__/goods";
import { UserProvider } from "@/entities/user";
import { useSearchStore } from "@/features/search";
import { QueryProvider } from "@/shared/providers/query-provider";

import { Catalog } from "./catalog";

import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

function StoreInitializer({
  children,
  searchTerm = ""
}: {
  children: ReactNode;
  searchTerm?: string;
}) {
  const updatePriceList = usePriceListStore(state => state.updatePriceList);
  const updateSearchTerm = useSearchStore(state => state.updateSearchTerm);

  useEffect(() => {
    updatePriceList(mockPriceList);
    updateSearchTerm(searchTerm);

    return () => {
      updateSearchTerm("");
    };
  }, [updatePriceList, updateSearchTerm, searchTerm]);

  return <>{children}</>;
}

const meta: Meta<typeof Catalog> = {
  title: "Components/Catalog/Catalog",
  component: Catalog,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    Story => (
      <StoreInitializer>
        <QueryProvider>
          <UserProvider value={defaultContext}>
            <div style={{ minHeight: "100vh" }}>
              <Story />
            </div>
          </UserProvider>
        </QueryProvider>
      </StoreInitializer>
    )
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "archive", "updates"],
      description: "Вариант отображения каталога"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Catalog>;

export const Default: Story = {
  args: {
    variant: "default"
  }
};

export const Archive: Story = {
  args: {
    variant: "archive"
  }
};

export const Updates: Story = {
  args: {
    variant: "updates"
  }
};

export const WithSearch: Story = {
  decorators: [
    Story => (
      <StoreInitializer searchTerm="Ноутбук">
        <UserProvider value={defaultContext}>
          <div style={{ minHeight: "100vh" }}>
            <Story />
          </div>
        </UserProvider>
      </StoreInitializer>
    )
  ],
  args: {
    variant: "default"
  }
};

export const WithFavoriteSections: Story = {
  decorators: [
    Story => (
      <StoreInitializer>
        <UserProvider
          value={{
            ...defaultContext,
            favoriteSections: ["Ноутбуки"]
          }}
        >
          <div style={{ minHeight: "100vh" }}>
            <Story />
          </div>
        </UserProvider>
      </StoreInitializer>
    )
  ],
  args: {
    variant: "default"
  }
};

export const WithHiddenSections: Story = {
  decorators: [
    Story => (
      <StoreInitializer>
        <UserProvider
          value={{
            ...defaultContext,
            hiddenSections: ["Ноутбуки"]
          }}
        >
          <div style={{ minHeight: "100vh" }}>
            <Story />
          </div>
        </UserProvider>
      </StoreInitializer>
    )
  ],
  args: {
    variant: "default"
  }
};
