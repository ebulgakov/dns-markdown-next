"use client";
import { PageTitle } from "@/app/components/ui/page-title";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Title } from "@/app/components/ui/title";
import {
  postAddToFavoriteSections,
  postAddToHiddenSections,
  postRemoveFromFavoriteSection,
  postRemoveFromHiddenSections
} from "@/services/user";

import { ProfileNotifications } from "./profile-notifications";
import { ProfileUpdateSections } from "./profile-update-sections";

import type { UserNotifications, UserSections } from "@/types/user";

type ProfileSectionsProps = {
  notifications: UserNotifications;
  favoriteSections: UserSections;
  hiddenSections: UserSections;
  email: string;
  allSections: string[];
};

function ProfileSections({
  notifications,
  favoriteSections,
  hiddenSections,
  email,
  allSections
}: ProfileSectionsProps) {
  return (
    <div>
      <PageTitle title="Профиль" />

      <Tabs defaultValue="notifications">
        <TabsList className="flex w-full flex-1 flex-col items-stretch md:flex-auto md:flex-row md:items-center">
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="mySections">Мои категории</TabsTrigger>
        </TabsList>

        <TabsContent value="mySections">
          <Title variant="h3" className="mb-4">
            Избранные категории
          </Title>

          <ProfileUpdateSections
            allSections={allSections}
            userSections={favoriteSections}
            onAddSection={postAddToFavoriteSections}
            onRemoveSection={postRemoveFromFavoriteSection}
            placeholder="Добавьте из левой колонки интересующие вас секции и они всегда будут показываться в верху списка"
            buttonLabel="Добавить в избранные"
          />

          <hr className="my-6" />

          <Title variant="h3" className="mb-4">
            Скрытые категории
          </Title>

          <ProfileUpdateSections
            allSections={allSections}
            userSections={hiddenSections}
            onAddSection={postAddToHiddenSections}
            onRemoveSection={postRemoveFromHiddenSections}
            placeholder="Добавьте из левой колонки неинтересующие вас секции и они будут показываться в свёрнутом виде в прайслисте"
            buttonLabel="Скрывать эти секции"
          />
        </TabsContent>

        <TabsContent value="notifications">
          <ProfileNotifications notifications={notifications} email={email} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { ProfileSections };
