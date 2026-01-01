"use client";
import type { User as UserType } from "@/types/user";
import { useState } from "react";
import ProfileHiddenSections from "@/app/profile/ProfileSections/ProfileHiddenSections";
import ProfileFavoriteSections from "@/app/profile/ProfileSections/ProfileFavoriteSections";
import ProfileNotifications from "@/app/profile/ProfileSections/ProfileNotifications";

type ProfileSectionsProps = {
  notifications: UserType["notifications"];
  favoriteSections: UserType["favoriteSections"];
  hiddenSections: UserType["hiddenSections"];
  allSections: string[];
};

type AvailableTabs = "notifications" | "favoriteSections" | "hiddenSections";

export default function ProfileSections({
  notifications,
  favoriteSections,
  hiddenSections,
  allSections
}: ProfileSectionsProps) {
  const [activeTab, setActiveTab] = useState<AvailableTabs>("favoriteSections");
  const tabs: AvailableTabs[] = ["favoriteSections", "hiddenSections", "notifications"];
  return (
    <div>
      {tabs.map(tab => (
        <button key={tab} onClick={() => setActiveTab(tab)}>
          {tab}
        </button>
      ))}

      {activeTab === "hiddenSections" && (
        <ProfileHiddenSections allSections={allSections} hiddenSections={hiddenSections} />
      )}

      {activeTab === "favoriteSections" && (
        <ProfileFavoriteSections allSections={allSections} favoriteSections={favoriteSections} />
      )}

      {activeTab === "notifications" && <ProfileNotifications notifications={notifications} />}
    </div>
  );
}
