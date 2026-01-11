"use client";
import { PageTitle } from "@/app/components/ui/page-title";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";

import { ProfileNotifications } from "./profile-notifications";
import { ProfileUpdateSections } from "./profile-update-sections";

import type { UserNotifications, UserSections } from "@/types/user";

type ProfileSectionsProps = {
  notifications: UserNotifications;
  favoriteSections: UserSections;
  hiddenSections: UserSections;
  allSections: string[];
};

function ProfileSections({
  notifications,
  favoriteSections,
  hiddenSections,
  allSections
}: ProfileSectionsProps) {
  return (
    <div>
      <PageTitle title="Профиль" />

      <Tabs defaultValue="favoriteSections">
        <TabsList className="flex w-full flex-1 flex-col items-stretch md:flex-auto md:flex-row md:items-center">
          <TabsTrigger value="favoriteSections">Избранные категории</TabsTrigger>
          <TabsTrigger value="hiddenSections">Скрытые категории</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
        </TabsList>

        <TabsContent value="favoriteSections">
          <ProfileUpdateSections
            allSections={allSections}
            userSections={favoriteSections}
            sectionName="favoriteSections"
            placeholder="Добавьте из левой колонки интересующие вас секции и они всегда будут показываться в верху списка"
            buttonLabel="Добавить в избранные"
          />
        </TabsContent>

        <TabsContent value="hiddenSections">
          <ProfileUpdateSections
            allSections={allSections}
            userSections={hiddenSections}
            sectionName="hiddenSections"
            placeholder="Добавьте из левой колонки неинтересующие вас секции и они будут показываться в свёрнутом виде в прайслисте"
            buttonLabel="Скрывать эти секции"
          />
        </TabsContent>

        <TabsContent value="notifications">
          <ProfileNotifications notifications={notifications} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { ProfileSections };
