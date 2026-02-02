import { getLastPriceList } from "@/api/get";
import { getUser } from "@/api/post";
import { ProfileSections } from "@/app/components/profile-sections";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

export default async function ProfilePage() {
  let profile;
  let allSections;

  try {
    profile = await getUser();
    const lastPriceList = await getLastPriceList(profile.city);
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
      notifications={profile.notifications}
      hiddenSections={profile.hiddenSections}
      favoriteSections={profile.favoriteSections}
      email={profile.email}
      allSections={allSections}
    />
  );
}
