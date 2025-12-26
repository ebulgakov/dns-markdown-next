import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import ActiveLink from "@/app/components/ActiveLink";

export default function Navbar() {
  return (
    <header className="flex h-10 items-center gap-4 bg-blue-400 mt-4">
      <nav className="flex">
        <Link href="/" className="bg-white font-bold text-blue-400 h-10 flex items-center px-3">
          DNS Уценка
        </Link>
        <ActiveLink
          href="/catalog"
          activeClassName="bg-orange-400 text-shadow-xs"
          className=" text-white h-10 flex items-center px-3"
        >
          Прайслист
        </ActiveLink>
        <ActiveLink
          href="/archive"
          activeClassName="bg-orange-400 text-shadow-xs"
          className="text-white h-10 flex items-center px-3"
        >
          Архив
        </ActiveLink>
        <ActiveLink
          href="/updates"
          activeClassName="bg-orange-400 text-shadow-xs"
          className=" text-white h-10 flex items-center px-3"
        >
          Обновления
        </ActiveLink>
        <ActiveLink
          href="/favorites"
          activeClassName="bg-orange-400 text-shadow-xs"
          className="text-white h-10 flex items-center px-3"
        >
          Избранное
        </ActiveLink>
        <ActiveLink
          href="/profile"
          activeClassName="bg-orange-400 text-shadow-xs"
          className=" text-white h-10 flex items-center px-3"
        >
          Профиль
        </ActiveLink>
      </nav>

      <div className="ml-auto mr-2 size-7">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
