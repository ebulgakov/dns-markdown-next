import { ScrollToTop } from "./scroll-to-top";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/ScrollToTop",
  component: ScrollToTop,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    Story => (
      <div style={{ height: "200vh", position: "relative" }}>
        <p style={{ padding: 16 }}>Прокрутите вниз, чтобы увидеть кнопку</p>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ScrollToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithJumpToSearch: Story = {
  args: {
    variant: "with-jump-to-search"
  }
};
