import { useEffect } from "react";

import { defaultContext } from "@/app/components/product-card/__mocks__/context";
import { UserProvider } from "@/app/contexts/user-context";
import { usePriceListStore } from "@/app/stores/pricelist-store";

import { CatalogHeader } from "./catalog-header";

import type { VisualizationHeader } from "@/types/visualization";
import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

function PriceListStoreInitializer({ children, city }: { children: ReactNode; city: string }) {
  const updatePriceList = usePriceListStore(state => state.updatePriceList);

  useEffect(() => {
    updatePriceList({
      _id: "mock-id",
      city,
      positions: [],
      createdAt: new Date().toISOString()
    });
  }, [city, updatePriceList]);

  return <>{children}</>;
}

const sampleHeader: VisualizationHeader = {
  type: "header",
  title: "Ноутбуки",
  itemsCount: 42
};

const meta: Meta<typeof CatalogHeader> = {
  title: "Components/Catalog/CatalogHeader",
  component: CatalogHeader,
  tags: ["autodocs"],
  decorators: [
    Story => (
      <PriceListStoreInitializer city="Test City">
        <UserProvider value={defaultContext}>
          <div className="relative">
            <Story />
          </div>
        </UserProvider>
      </PriceListStoreInitializer>
    )
  ],
  argTypes: {
    header: { control: "object", description: "Заголовок секции каталога" },
    shownHeart: { control: "boolean", description: "Показывать иконку избранного" },
    disabledCollapse: { control: "boolean", description: "Отключить сворачивание секции" }
  }
};

export default meta;
type Story = StoryObj<typeof CatalogHeader>;

export const Default: Story = {
  args: {
    header: sampleHeader,
    shownHeart: true
  }
};

export const WithoutHeart: Story = {
  args: {
    header: sampleHeader,
    shownHeart: false
  }
};

export const DisabledCollapse: Story = {
  args: {
    header: sampleHeader,
    shownHeart: true,
    disabledCollapse: true
  }
};

export const FavoriteSection: Story = {
  decorators: [
    Story => (
      <PriceListStoreInitializer city="Москва">
        <UserProvider
          value={{
            ...defaultContext,
            favoriteSections: [sampleHeader.title]
          }}
        >
          <div className="relative">
            <Story />
          </div>
        </UserProvider>
      </PriceListStoreInitializer>
    )
  ],
  args: {
    header: sampleHeader,
    shownHeart: true
  }
};

export const HiddenSection: Story = {
  decorators: [
    Story => (
      <PriceListStoreInitializer city="Москва">
        <UserProvider
          value={{
            ...defaultContext,
            hiddenSections: [sampleHeader.title]
          }}
        >
          <div className="relative">
            <Story />
          </div>
        </UserProvider>
      </PriceListStoreInitializer>
    )
  ],
  args: {
    header: sampleHeader,
    shownHeart: true
  }
};

export const LongTitle: Story = {
  args: {
    header: {
      type: "header",
      title: "Комплектующие для персональных компьютеров и серверного оборудования",
      itemsCount: 1287
    },
    shownHeart: true
  }
};
