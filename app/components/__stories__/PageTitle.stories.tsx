import type { Meta, StoryObj } from "@storybook/react";
import PageTitle from "../PageTitle";
import Button from "../Button";

const meta: Meta<typeof PageTitle> = {
  title: "Components/PageTitle",
  component: PageTitle,
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    subTitle: { control: "text" },
    children: { control: false }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Page Title"
  }
};

export const WithSubtitle: Story = {
  args: {
    title: "Page Title",
    subTitle: "This is a subtitle"
  }
};

export const WithChildren: Story = {
  args: {
    title: "Page Title",
    children: <Button>Click me</Button>
  }
};

export const WithSubtitleAndChildren: Story = {
  args: {
    title: "Page Title",
    subTitle: "This is a subtitle",
    children: <Button>Click me</Button>
  }
};
