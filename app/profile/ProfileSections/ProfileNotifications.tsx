import type { User as UserType } from "@/types/user";
import PageSubTitle from "@/app/components/PageSubTitle";

type ProfileNotificationsProps = {
  notifications: UserType["notifications"];
};

export default function ProfileNotifications({}: ProfileNotificationsProps) {
  return (
    <div>
      <PageSubTitle title="Уведомления" />
      Profile Notifications
    </div>
  );
}
