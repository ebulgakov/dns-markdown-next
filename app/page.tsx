import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      This is a landing page.&nbsp;
      <SignedIn>
        <Link href="/catalog">
          <span className="text-blue-500 hover:underline">Visit the catalog page</span>
        </Link>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
          <span className="text-blue-500 hover:underline">Please auth before</span>
        </Link>
      </SignedOut>
    </div>
  );
}
