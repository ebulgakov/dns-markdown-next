import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationActiveLink,
  NavigationMenuItem
} from "@/app/components/ui/navigation-menu";
import { Button } from "@/app/components/ui/button";

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
    <header className="flex items-center gap-4 border-2 border-primary py-2 rounded">
      <NavigationMenu>
        <Button asChild variant="link" className="font-bold">
          <Link href="/">{t("logo")}</Link>
        </Button>

        <SignedIn>
          <NavigationMenuList>
            {linksList.map(link => (
              <NavigationMenuItem key={link.name}>
                <NavigationActiveLink link={link}>{link.name}</NavigationActiveLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </SignedIn>
      </NavigationMenu>

      <NavigationMenu className="ml-auto mr-2">
        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton>
              <Button variant="link">{t("signin")}</Button>
            </SignInButton>
            <div className="border-l-2 border-primary h-6"></div>
            <SignUpButton>
              <Button variant="link">{t("signup")}</Button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="size-7">
            <UserButton />
          </div>
        </SignedIn>
      </NavigationMenu>
    </header>
  );
}
