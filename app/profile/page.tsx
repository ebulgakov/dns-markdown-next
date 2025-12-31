import { getUser } from "@/db/profile/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import PageTitle from "@/app/components/PageTitle";
import ProfileSections from "@/app/profile/ProfileSections/ProfileSections";
import { getLastPriceList } from "@/db/pricelist/queries";

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
    return <ErrorMessage>{message}</ErrorMessage>;
  }

  return (
    <div>
      <PageTitle title="Профиль" />
      <ProfileSections
        notifications={profile.notifications}
        hiddenSections={profile.hiddenSections}
        favoriteSections={profile.favoriteSections}
        allSections={allSections}
      />
    </div>
  );
}
