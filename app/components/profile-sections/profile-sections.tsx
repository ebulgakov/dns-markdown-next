"use client";
import type { UserNotifications, UserSections } from "@/types/user";
import { useState } from "react";
import { ProfileUpdateSections } from "./profile-update-sections";
import { ProfileNotifications } from "./profile-notifications";
import { PageTitle } from "@/app/components/ui/page-title";
import { Button } from "@/app/components/ui/button";

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

function ProfileSections({
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
            variant={id === activeTab ? "default" : "outline"}
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

export { ProfileSections };
