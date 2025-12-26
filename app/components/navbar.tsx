import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex h-10 items-center gap-4 bg-blue-400 mt-4">
      <nav className="flex">
        <Link href="/" className="bg-white font-bold text-blue-400 h-10 flex items-center px-3">
          DNS Уценка
        </Link>
        <Link href="/catalog" className="bg-orange-400 text-white h-10 flex items-center px-3">
          Прайслист
        </Link>
        <Link href="/archive" className="text-white h-10 flex items-center px-3">
          Архив
        </Link>
        <Link href="/" className=" text-white h-10 flex items-center px-3">
          Обновления
        </Link>
        <Link href="/" className="text-white h-10 flex items-center px-3">
          Избранное
        </Link>
        <Link href="/" className=" text-white h-10 flex items-center px-3">
          Профиль
        </Link>
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
