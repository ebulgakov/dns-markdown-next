import { getUser } from "@/db/profile/queries";
import ErrorMessage from "@/app/components/ErrorMessage";

export default async function ProfilePage() {
  let profile;
  let error: Error | null = null;

  try {
    profile = await getUser();
  } catch (e) {
    error = e as Error;
  }

  if (!profile && error) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>
      <div className="text-lg">{JSON.stringify(profile, null, 2)}</div>
    </div>
  );
}
