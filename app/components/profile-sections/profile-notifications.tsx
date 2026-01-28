"use client";

import { Title } from "@/app/components/ui/title";

import type { UserNotifications } from "@/types/user";
import { Button } from "@/app/components/ui/button";
import { useTransition } from "react";
import { updateUserSection } from "@/db/user/mutations/update-user-section";

type ProfileNotificationsProps = {
  notifications: UserNotifications;
  email: string;
};

function ProfileNotifications({ notifications, email }: ProfileNotificationsProps) {
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const newSections = await updateUserSection(
        {
          updates: {
            enabled: true
          }
        },
        "notifications"
      );
    });
  };

  return (
    <div>
      <Title variant="h2">Уведомления</Title>
      email: {email}
      <div>
        <pre>{JSON.stringify(notifications, null, 2)}</pre>
      </div>
      <Button disabled={isPending} onClick={handleSave}>
        Сохранить настройки уведомлений
      </Button>
    </div>
  );
}

export { ProfileNotifications };
