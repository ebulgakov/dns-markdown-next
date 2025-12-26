import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-full flex items-center justify-center">
      <SignIn />
    </div>
  );
}
