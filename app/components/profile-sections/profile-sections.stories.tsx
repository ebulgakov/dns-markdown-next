import { ProfileSections } from "./profile-sections";

import type { UserNotifications, UserSections } from "@/types/user";
import type { Meta, StoryObj } from "@storybook/react";

const mockNotifications: UserNotifications = {
  updates: {
    interval: "daily",
    fields: {
      new: true,
      prices: true,
      profit: false
    }
  },
  favorites: {
    interval: "weekly"
  },
  favoriteSections: {
    interval: "daily"
  }
};

const mockFavoriteSections: UserSections = ["Laptops", "Smartphones"];
const mockHiddenSections: UserSections = ["Monitors"];
const mockAllSections: string[] = ["Laptops", "Smartphones", "Monitors", "Keyboards", "Mice"];

const meta = {
  title: "Components/Profile/ProfileSections",
  component: ProfileSections,
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"],
  argTypes: {}
} satisfies Meta<typeof ProfileSections>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    notifications: mockNotifications,
    favoriteSections: mockFavoriteSections,
    hiddenSections: mockHiddenSections,
    allSections: mockAllSections
  }
};
