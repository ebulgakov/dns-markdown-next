import { useEffect } from "react";

import {
  defaultContext,
  filledWithFavoritesSectionsContext,
  filledWithHiddenSectionsContext,
  filledWithHiddenAndFavoritesSectionsContext
} from "@/app/components/product-card/__mocks__/context";
import { mockPriceList } from "@/app/components/product-card/__mocks__/goods";
import { UserProvider } from "@/app/contexts/user-context";
import { usePriceListStore } from "@/app/stores/pricelist-store";

import { JumpToSection } from "./jump-to-section";

import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

function StoreInitializer({ children }: { children: ReactNode }) {
  const updatePriceList = usePriceListStore(state => state.updatePriceList);

  useEffect(() => {
    updatePriceList(mockPriceList);
  }, [updatePriceList]);

  return <>{children}</>;
}

const meta: Meta<typeof JumpToSection> = {
  title: "Components/JumpToSection",
  component: JumpToSection,
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
  ]
};

export default meta;
type Story = StoryObj<typeof JumpToSection>;

export const Default: Story = {};

export const WithFavoriteSections: Story = {
  decorators: [
    Story => (
      <StoreInitializer>
        <UserProvider value={filledWithFavoritesSectionsContext}>
          <div style={{ minHeight: "100vh" }}>
            <Story />
          </div>
        </UserProvider>
      </StoreInitializer>
    )
  ]
};

export const WithHiddenSections: Story = {
  decorators: [
    Story => (
      <StoreInitializer>
        <UserProvider value={filledWithHiddenSectionsContext}>
          <div style={{ minHeight: "100vh" }}>
            <Story />
          </div>
        </UserProvider>
      </StoreInitializer>
    )
  ]
};

export const WithHiddenAndFavoriteSections: Story = {
  decorators: [
    Story => (
      <StoreInitializer>
        <UserProvider value={filledWithHiddenAndFavoritesSectionsContext}>
          <div style={{ minHeight: "100vh" }}>
            <Story />
          </div>
        </UserProvider>
      </StoreInitializer>
    )
  ]
};
