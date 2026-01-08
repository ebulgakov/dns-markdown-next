import type { UserNotifications } from "@/types/user";
import { Title } from "@/app/components/ui/title";

type ProfileNotificationsProps = {
  notifications: UserNotifications;
};

export default function ProfileNotifications({ notifications }: ProfileNotificationsProps) {
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
