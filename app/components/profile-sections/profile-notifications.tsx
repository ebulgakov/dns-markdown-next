"use client";

import { useState, useTransition } from "react";

import { Button } from "@/app/components/ui/button";
import { CheckboxWithLabel } from "@/app/components/ui/control-with-label";
import { Input } from "@/app/components/ui/input";
import { Title } from "@/app/components/ui/title";
import { postUpdateUserNotifications } from "@/services/post";

import type { UserNotifications } from "@/types/user";

type ProfileNotificationsProps = {
  notifications: UserNotifications;
  email: string;
};

function ProfileNotifications({ notifications, email }: ProfileNotificationsProps) {
  const [enabledUpdate, setEnabledUpdate] = useState(notifications.updates.enabled);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await postUpdateUserNotifications({
          updates: {
            enabled: enabledUpdate
          }
        });
      } catch (error) {
        console.error("Failed to update notifications:", error);
      }
    });
  };

  return (
    <div className="max-w-2xl">
      <Title variant="h2">Уведомления</Title>
      <div className="space-y-7">
        <div className="flex items-center gap-4">
          <div>E-mail</div>
          <div className="flex-1">
            <Input value={email} disabled={true} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>Уведомления</div>
          <div className="flex-1">
            <CheckboxWithLabel
              label="Получать уведомления об изменении цены и наличии товаров в избранном"
              checked={enabledUpdate}
              onCheckedChange={checked => setEnabledUpdate(!!checked)}
            />
          </div>
        </div>
        <Button disabled={isPending} onClick={handleSave}>
          Сохранить настройки уведомлений
        </Button>
      </div>
    </div>
  );
}

export { ProfileNotifications };
