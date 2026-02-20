import { useEffect } from "react";

import { defaultContext } from "@/app/components/product-card/__mocks__/context";
import { mockPriceList } from "@/app/components/product-card/__mocks__/goods";
import { UserProvider } from "@/app/contexts/user-context";
import { usePriceListStore } from "@/app/stores/pricelist-store";
import { useSearchStore } from "@/app/stores/search-store";

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
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    Story => (
      <StoreInitializer>
        <UserProvider value={defaultContext}>
          <div style={{ minHeight: "100vh" }}>
            <Story />
          </div>
        </UserProvider>
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
