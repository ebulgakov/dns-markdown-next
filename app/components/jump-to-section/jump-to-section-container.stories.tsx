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

import { JumpToSectionContainer } from "./jump-to-section-container";

import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

function StoreInitializer({ children }: { children: ReactNode }) {
  const updatePriceList = usePriceListStore(state => state.updatePriceList);

  useEffect(() => {
    updatePriceList(mockPriceList);
  }, [updatePriceList]);

  return <>{children}</>;
}

const meta: Meta<typeof JumpToSectionContainer> = {
  title: "Components/JumpToSection/JumpToSectionContainer",
  component: JumpToSectionContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  args: {
    onClose: () => {}
  },
  decorators: [
    Story => (
      <StoreInitializer>
        <UserProvider value={defaultContext}>
          <div style={{ width: 370, minHeight: 400 }}>
            <Story />
          </div>
        </UserProvider>
      </StoreInitializer>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof JumpToSectionContainer>;

export const Default: Story = {};

export const WithFavoriteSections: Story = {
  decorators: [
    Story => (
      <StoreInitializer>
        <UserProvider value={filledWithFavoritesSectionsContext}>
          <div style={{ width: 370, minHeight: 400 }}>
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
          <div style={{ width: 370, minHeight: 400 }}>
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
          <div style={{ width: 370, minHeight: 400 }}>
            <Story />
          </div>
        </UserProvider>
      </StoreInitializer>
    )
  ]
};
