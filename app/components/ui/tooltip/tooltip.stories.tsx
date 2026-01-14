import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip/tooltip";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: {
    delayDuration: 0
  },
  argTypes: {
    delayDuration: {
      control: {
        type: "number"
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: args => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">Наведи на меня</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Подсказка</p>
      </TooltipContent>
    </Tooltip>
  )
};
