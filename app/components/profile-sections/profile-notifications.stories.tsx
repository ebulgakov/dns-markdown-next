import { ProfileNotifications } from "./profile-notifications";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ProfileNotifications> = {
  title: "Components/Profile/Notifications",
  component: ProfileNotifications,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;
type Story = StoryObj<typeof ProfileNotifications>;

export const Default: Story = {
  args: {
    notifications: {
      updates: {
        enabled: false
      }
    },
    email: "test@example.com"
  }
};
