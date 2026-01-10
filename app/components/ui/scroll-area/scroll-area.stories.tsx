import { ScrollArea } from "./scroll-area";

import type { Meta, StoryObj } from "@storybook/react";


const meta: Meta<typeof ScrollArea> = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: args => (
    <ScrollArea className="h-72 w-48 rounded-md border" {...args}>
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 })
          .map((_, i, a) => `v1.2.0-beta.${a.length - i}`)
          .map(tag => (
            <div key={tag} className="text-sm">
              {tag}
            </div>
          ))}
      </div>
    </ScrollArea>
  )
};
