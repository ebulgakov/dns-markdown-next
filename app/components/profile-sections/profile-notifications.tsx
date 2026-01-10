"use client";

import { Title } from "@/app/components/ui/title";

import type { UserNotifications } from "@/types/user";

type ProfileNotificationsProps = {
  notifications: UserNotifications;
};

function ProfileNotifications({ notifications }: ProfileNotificationsProps) {
  return (
    <div>
      <Title variant="h2">Уведомления</Title>
      <details>
        <summary>
          <p>Раздел пока в разработке</p>
        </summary>
        <pre>{JSON.stringify(notifications, null, 2)}</pre>
      </details>
    </div>
  );
}

export { ProfileNotifications };
