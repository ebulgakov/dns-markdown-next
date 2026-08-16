import { getLastPriceList } from "@/entities/product";
import { getRealUser } from "@/entities/user"; // I need exactly the real user, not the guest
import { ErrorAlert } from "@/shared/ui/error-alert";

import { ProfileSections } from "./profile-sections";

async function ProfilePage() {
  let user;
  let allSections;

  try {
    user = await getRealUser();
    if (!user) throw new Error("User not found");

    const lastPriceList = await getLastPriceList(user.city);
    if (!lastPriceList) throw new Error("Price list not found for user's city");
    allSections = lastPriceList.positions.map(position => position.title);
  } catch (e) {
    const { message } = e as Error;
    return <ErrorAlert title="Ошибка загрузки профиля" message={message} />;
  }

  return (
    <ProfileSections
      notifications={user.notifications}
      hiddenSections={user.hiddenSections}
      favoriteSections={user.favoriteSections}
      email={user.email}
      allSections={allSections}
    />
  );
}

export { ProfilePage };
