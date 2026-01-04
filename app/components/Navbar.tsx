import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import ActiveLink from "@/app/components/ActiveLink";

export default function Navbar() {
  const linksList: {
    name: string;
    url: string;
  }[] = [
    {
      name: "Прайслист",
      url: "/catalog"
    },
    {
      name: "Архив",
      url: "/archive"
    },
    {
      name: "Обновления",
      url: "/updates"
    },
    {
      name: "Избранное",
      url: "/favorites"
    },
    {
      name: "Профиль",
      url: "/profile"
    }
  ];

  return (
    <header className="flex h-10 items-center gap-4 bg-driftwood px-2 shadow-md">
      <div className="text-coral">Hello!</div>
      <nav className="flex">
        <Link href="/" className="bg-white font-bold text-blue-400 h-10 flex items-center px-3">
          DNS Уценка
        </Link>
        <SignedIn>
          {linksList.map(link => (
            <ActiveLink
              key={link.name}
              href={link.url}
              activeClassName="bg-orange-400 text-shadow-xs"
              className=" text-white h-10 flex items-center px-3"
            >
              {link.name}
            </ActiveLink>
          ))}
        </SignedIn>
      </nav>

      <SignedOut>
        <div className="ml-auto mr-2 divide-x">
          <SignInButton>
            <button className="font-bold text-nowrap text-white pr-3">Войти</button>
          </SignInButton>
          <SignUpButton>
            <button className="font-bold text-nowrap text-white pl-3">Зарегистироваться</button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="ml-auto mr-2 size-7">
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}
