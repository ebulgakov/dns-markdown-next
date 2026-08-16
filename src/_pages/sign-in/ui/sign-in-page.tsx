import { SignIn } from "@clerk/nextjs";

function SignInPage() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <SignIn />
    </div>
  );
}

export { SignInPage };
