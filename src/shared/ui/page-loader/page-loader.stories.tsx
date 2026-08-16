import { PageLoader } from "./page-loader";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/PageLoader",
  component: PageLoader,
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta<typeof PageLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
