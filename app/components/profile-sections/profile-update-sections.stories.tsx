import type { Meta, StoryObj } from "@storybook/react";
import { ProfileUpdateSections } from "./profile-update-sections";

const meta: Meta<typeof ProfileUpdateSections> = {
  title: "Components/Profile/ProfileUpdateSections",
  component: ProfileUpdateSections,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const allSections = ["Section A", "Section B", "Section C", "Section D", "Section E", "Section F"];

const userSections = ["Section A", "Section C"];

export const Default: Story = {
  args: {
    sectionName: "favoriteSections",
    userSections: userSections,
    allSections: allSections,
    buttonLabel: "Add Sections",
    placeholder: "No active sections"
  }
};
