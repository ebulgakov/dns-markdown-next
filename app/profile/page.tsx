import { getUser } from "@/db/user/queries";
import { ProfileSections } from "@/app/components/profile-sections";
import { getLastPriceList } from "@/db/pricelist/queries";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

export default async function ProfilePage() {
  let profile;
  let allSections;

  try {
    //
    profile = await getUser();
    if (!profile) throw new Error("No user found!");
    profile = JSON.parse(JSON.stringify(profile));

    //
    const lastPriceList = await getLastPriceList();
    if (!lastPriceList) throw new Error("No last prices found!");
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
      allSections={allSections}
    />
  );
}
