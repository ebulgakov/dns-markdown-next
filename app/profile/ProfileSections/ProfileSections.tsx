"use client";
import type { UserNotifications, UserSections } from "@/types/user";
import { useState } from "react";
import ProfileUpdateSections from "@/app/profile/ProfileSections/ProfileUpdateSections";
import ProfileNotifications from "@/app/profile/ProfileSections/ProfileNotifications";
import PageTitle from "@/app/components/PageTitle";
import Button from "@/app/components/Button";

type ProfileSectionsProps = {
  notifications: UserNotifications;
  favoriteSections: UserSections;
  hiddenSections: UserSections;
  allSections: string[];
};

type AvailableTabs = "notifications" | "favoriteSections" | "hiddenSections";

const tabs: { id: AvailableTabs; label: string }[] = [
  {
    id: "favoriteSections",
    label: "Избранные категории"
  },
  {
    id: "hiddenSections",
    label: "Скрытые категории"
  },
  {
    id: "notifications",
    label: "Уведомления"
  }
];

export default function ProfileSections({
  notifications,
  favoriteSections,
  hiddenSections,
  allSections
}: ProfileSectionsProps) {
  const [activeTab, setActiveTab] = useState<AvailableTabs>("favoriteSections");

  return (
    <div>
      <PageTitle title="Профиль" />
      <div className="flex gap-2 mb-2">
        {tabs.map(({ id, label }) => (
          <Button
            variant={id === activeTab ? "primary" : "default"}
            key={id}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      {activeTab === "hiddenSections" && (
        <ProfileUpdateSections
          allSections={allSections}
          userSections={hiddenSections}
          sectionName="hiddenSections"
          placeholder="Добавьте из левой колонки неинтересующие вас секции и они будут показываться в свёрнутом виде в прайслисте"
          buttonLabel="Скрывать эти секции"
        />
      )}

      {activeTab === "favoriteSections" && (
        <ProfileUpdateSections
          allSections={allSections}
          userSections={favoriteSections}
          sectionName="favoriteSections"
          placeholder="Добавьте из левой колонки интересующие вас секции и они всегда будут показываться в верху списка"
          buttonLabel="Добавить в избранные"
        />
      )}

      {activeTab === "notifications" && <ProfileNotifications notifications={notifications} />}
    </div>
  );
}
