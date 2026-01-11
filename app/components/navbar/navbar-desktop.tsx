"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/app/components/ui/button";
import {
  NavigationActiveLink,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from "@/app/components/ui/navigation-menu";

import type { NavbarLinks } from "@/types/common";

type NavbarDesktopProps = {
  linksList: NavbarLinks;
};
function NavbarDesktop({ linksList }: NavbarDesktopProps) {
  const t = useTranslations("Navbar");

  return (
    <div className="border-primary flex items-center gap-4 rounded border-2 py-2">
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

      <NavigationMenu className="mr-3 ml-auto">
        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton>
              <Button variant="link">{t("signin")}</Button>
            </SignInButton>
            <div className="border-primary h-6 border-l-2"></div>
            <SignUpButton>
              <Button variant="link">{t("signup")}</Button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="size-7">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </NavigationMenu>
    </div>
  );
}

export { NavbarDesktop };
