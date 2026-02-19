import { useSearchStore } from "@/app/stores/search-store";

import { Search } from "./search";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Search> = {
  title: "Components/Search",
  component: Search,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    Story => {
      useSearchStore.setState({
        searchTerm: "",
        updateSearchTerm: (term: string) => useSearchStore.setState({ searchTerm: term })
      });
      return <Story />;
    }
  ]
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {
  name: "Default (empty)"
};

export const WithSearchTerm: Story = {
  name: "With search term",
  decorators: [
    Story => {
      useSearchStore.setState({
        searchTerm: "Смартфон",
        updateSearchTerm: (term: string) => useSearchStore.setState({ searchTerm: term })
      });
      return <Story />;
    }
  ]
};
