import { CheckboxWithLabel } from "./control-with-label";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CheckboxWithLabel> = {
  title: "UI/ControlWithLabel/CheckboxWithLabel",
  component: CheckboxWithLabel,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Текст метки для чекбокса"
    },
    checked: {
      control: "boolean",
      description: "Состояние чекбокса"
    },
    disabled: {
      control: "boolean",
      description: "Отключен ли чекбокс"
    }
  }
};

export default meta;

type Story = StoryObj<typeof CheckboxWithLabel>;

export const Default: Story = {
  args: {
    label: "Согласен с условиями"
  }
};

export const Checked: Story = {
  args: {
    label: "Выбранный чекбокс",
    checked: true
  }
};

export const Disabled: Story = {
  args: {
    label: "Отключенный чекбокс",
    disabled: true
  }
};

export const DisabledChecked: Story = {
  args: {
    label: "Отключенный выбранный чекбокс",
    checked: true,
    disabled: true
  }
};
