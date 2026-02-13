import { ProfileSections } from "@/app/components/profile-sections";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { getLastPriceList } from "@/services/get";
import { getUser } from "@/services/user"; // I need exactly the real user, not the guest

export default async function ProfilePage() {
  let user;
  let allSections;

  try {
    user = await getUser();
    if (!user) throw new Error("User not found");

    const lastPriceList = await getLastPriceList(user.city);
    if (!lastPriceList) throw new Error("Price list not found for user's city");
    allSections = lastPriceList.positions.map(position => position.title);
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки профиля</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
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
