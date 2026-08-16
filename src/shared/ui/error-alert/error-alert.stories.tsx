import { ErrorAlert } from "./error-alert";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ErrorAlert> = {
  title: "UI/ErrorAlert",
  component: ErrorAlert,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ErrorAlert>;

export const Default: Story = {
  render: args => (
    <div className="w-[480px]">
      <ErrorAlert {...args} />
    </div>
  ),
  args: {
    title: "Ошибка загрузки данных",
    message: "Что-то пошло не так"
  }
};

export const WithoutMessage: Story = {
  render: args => (
    <div className="w-[480px]">
      <ErrorAlert {...args} />
    </div>
  ),
  args: {
    title: "Ошибка загрузки данных"
  }
};
