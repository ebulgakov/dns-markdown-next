
import { Button } from "@/app/components/ui/button/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./card";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {}
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: args => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Заголовок карточки</CardTitle>
        <CardDescription>Описание карточки</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Содержимое карточки</p>
      </CardContent>
      <CardFooter>
        <p>Подвал карточки</p>
      </CardFooter>
    </Card>
  )
};

export const WithAction: Story = {
  render: args => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Заголовок карточки</CardTitle>
        <CardDescription>Описание карточки</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Действие
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Содержимое карточки</p>
      </CardContent>
      <CardFooter>
        <Button>Действие в подвале</Button>
      </CardFooter>
    </Card>
  )
};
