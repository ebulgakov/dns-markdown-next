import { getUser } from "@/db/profile/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import PageTitle from "@/app/components/PageTitle";

export default async function ProfilePage() {
  let profile;

  try {
    profile = await getUser();
  } catch (e) {
    const { message } = e as Error;
    return <ErrorMessage>{message}</ErrorMessage>;
  }

  return (
    <div>
      <PageTitle title="Профиль" />
      <div className="text-lg">{JSON.stringify(profile, null, 2)}</div>
    </div>
  );
}
