import { RocketIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./alert";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: args => (
    <Alert {...args} className="w-[480px]">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  )
};

export const WithIcon: Story = {
  render: args => (
    <Alert {...args} className="w-[480px]">
      <RocketIcon />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  )
};

export const Destructive: Story = {
  render: args => (
    <Alert {...args} variant="destructive" className="w-[480px]">
      <RocketIcon />
      <AlertTitle>Destructive</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  )
};

export const Info: Story = {
  render: args => (
    <Alert {...args} variant="info" className="w-[480px]">
      <RocketIcon />
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  )
};

export const Success: Story = {
  render: args => (
    <Alert {...args} variant="success" className="w-[480px]">
      <RocketIcon />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  )
};

export const Warning: Story = {
  render: args => (
    <Alert {...args} variant="warning" className="w-[480px]">
      <RocketIcon />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  )
};
