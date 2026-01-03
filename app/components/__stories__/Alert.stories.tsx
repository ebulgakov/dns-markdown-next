import type { Meta, StoryObj } from "@storybook/react";
import Alert from "../Alert";

const meta: Meta<typeof Alert> = {
  title: "components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: {
        type: "select"
      },
      options: ["success", "error", "info"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Success: Story = {
  args: {
    variant: "success",
    children: "This is a success message."
  }
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "This is an error message."
  }
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "This is an informational message."
  }
};
