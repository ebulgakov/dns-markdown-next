import { getUser } from "@/db/profile/queries";
import ErrorMessage from "@/app/components/ErrorMessage";

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
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>
      <div className="text-lg">{JSON.stringify(profile, null, 2)}</div>
    </div>
  );
}
