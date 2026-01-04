import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import ActiveLink from "@/app/components/ActiveLink";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const linksList: {
    name: string;
    url: string;
  }[] = [
    {
      name: t("catalog"),
      url: "/catalog"
    },
    {
      name: t("archive"),
      url: "/archive"
    },
    {
      name: t("updates"),
      url: "/updates"
    },
    {
      name: t("favorites"),
      url: "/favorites"
    },
    {
      name: t("profile"),
      url: "/profile"
    }
  ];

  return (
    <header className="flex h-10 items-center gap-4 bg-blue-400">
      <nav className="flex">
        <Link href="/" className="bg-white font-bold text-blue-400 h-10 flex items-center px-3">
          {t("logo")}
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
            <button className="font-bold text-nowrap text-white pr-3">{t("signin")}</button>
          </SignInButton>
          <SignUpButton>
            <button className="font-bold text-nowrap text-white pl-3">{t("signup")}</button>
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
