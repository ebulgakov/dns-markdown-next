import { SignUp } from "@clerk/nextjs";

function SignUpPage() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <SignUp />
    </div>
  );
}

export { SignUpPage };
