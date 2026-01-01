import type { UserNotifications } from "@/types/user";
import PageSubTitle from "@/app/components/PageSubTitle";

type ProfileNotificationsProps = {
  notifications: UserNotifications;
};

export default function ProfileNotifications({ notifications }: ProfileNotificationsProps) {
  return (
    <div>
      <PageSubTitle title="Уведомления" />
      <p>Раздел пока в разработке</p>

      <pre>{JSON.stringify(notifications, null, 2)}</pre>
    </div>
  );
}
