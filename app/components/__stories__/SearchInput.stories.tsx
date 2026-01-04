import type { Meta, StoryObj } from "@storybook/react";
import SearchInput from "../SearchInput";
import { expect } from "storybook/test";
import { useSearchStore } from "@/app/stores/searchStore";

const meta: Meta<typeof SearchInput> = {
  title: "Components/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    Story => {
      // Reset store before each story
      useSearchStore.setState({
        searchTerm: "",
        updateSearchTerm: () => {}
      });
      return <Story />;
    }
  ]
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  name: "Hidden by default",
  play: async ({ canvas }) => {
    const searchButton = canvas.getByRole("button");
    await expect(searchButton).toBeInTheDocument();
    const input = canvas.queryByRole("search");
    await expect(input).not.toBeInTheDocument();
  }
};

export const Visible: Story = {
  name: "Visible after clicking the button",
  play: async ({ canvas, userEvent }) => {
    const searchButton = await canvas.findByRole("button");
    await userEvent.click(searchButton);
    const input = await canvas.findByRole("search");
    await expect(input).toBeInTheDocument();
  }
};

export const WithSearchTerm: Story = {
  name: "Displays and updates search term",
  play: async ({ canvas, userEvent }) => {
    const searchTerm = "test search";

    // Mock the store state for this story
    useSearchStore.setState({
      searchTerm: searchTerm,
      updateSearchTerm: term => {
        useSearchStore.setState({ searchTerm: term });
      }
    });

    const searchButton = await canvas.findByRole("button");
    await userEvent.click(searchButton);
    const input = (await canvas.findByRole("search")) as HTMLInputElement;
    await expect(input.value).toBe(searchTerm);

    const newSearchTerm = "new value";
    await userEvent.type(input, newSearchTerm);
    await expect(input.value).toBe(searchTerm + newSearchTerm);
  }
};
