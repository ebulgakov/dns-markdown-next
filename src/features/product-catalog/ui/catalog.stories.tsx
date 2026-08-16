import { useEffect } from "react";

import { usePriceListStore } from "@/entities/product";
import { defaultContext } from "@/entities/product/ui/__mocks__/context";
import { mockPriceList } from "@/entities/product/ui/__mocks__/goods";
import { UserProvider } from "@/entities/user";
import { useSearchStore } from "@/features/search";
import { useFilteredGoods } from "@/features/sort-goods";
import { QueryProvider } from "@/shared/providers";

import { Catalog } from "./catalog";

import type { CatalogComponentVariant } from "../model/types";
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

// Mirrors the composition `_pages` callers now do — Catalog itself no
// longer reaches into search/sort-goods (Strategy C, not D).
function ComposedCatalog({ variant }: { variant: CatalogComponentVariant }) {
  const searchTerm = useSearchStore(state => state.searchTerm);
  const { flattenList, flattenTitles } = useFilteredGoods({
    filterTerm: searchTerm,
    hasNoModifyOutput: variant === "updates"
  });

  return (
    <Catalog
      variant={variant}
      flattenList={flattenList}
      flattenTitles={flattenTitles}
      disabledCollapse={variant !== "updates" && searchTerm.length > 0}
    />
  );
}

const meta: Meta<typeof ComposedCatalog> = {
  title: "Components/Catalog/Catalog",
  component: ComposedCatalog,
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
type Story = StoryObj<typeof ComposedCatalog>;

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
