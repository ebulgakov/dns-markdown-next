import { useEffect } from "react";

import { usePriceListStore } from "@/entities/product";
import {
  defaultContext,
  filledWithFavoritesSectionsContext,
  filledWithHiddenSectionsContext,
  filledWithHiddenAndFavoritesSectionsContext
} from "@/entities/product/ui/__mocks__/context";
import { mockPriceList } from "@/entities/product/ui/__mocks__/goods";
import { UserProvider } from "@/entities/user";

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
  parameters: {
    layout: "fullscreen"
  },
  args: {
    onReset: () => {}
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
