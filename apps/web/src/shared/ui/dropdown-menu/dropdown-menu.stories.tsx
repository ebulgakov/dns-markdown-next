import { Button } from "@/shared/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./dropdown-menu";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DropdownMenu> = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: args => (
    <DropdownMenu {...args} open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Открыть меню</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Профиль</DropdownMenuItem>
          <DropdownMenuItem>Настройки</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export const WithCheckboxAndRadio: Story = {
  render: args => (
    <DropdownMenu {...args} open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Вид списка</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked>Показывать цены</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="grid">
          <DropdownMenuRadioItem value="grid">Плитка</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="list">Список</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};
