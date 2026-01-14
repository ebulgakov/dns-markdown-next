"use client";

import { SignedIn, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

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
  userLinks: NavbarLinks;
  isUserLoggedIn?: boolean;
  city?: string;
};
function NavbarDesktop({ linksList, isUserLoggedIn, userLinks, city }: NavbarDesktopProps) {
  const t = useTranslations("Navbar");
  const cities = useTranslations("cities");

  return (
    <div
      data-testid="desktop-navbar-user"
      className="border-primary flex items-center gap-4 rounded border-2 py-2"
    >
      <NavigationMenu>
        <Button asChild variant="link" className="font-bold">
          <Link href="/">
            {t("logo")} {city ? cities(city) : ""}
          </Link>
        </Button>

        <NavigationMenuList>
          {linksList.map(link => (
            <NavigationMenuItem key={link.name}>
              <NavigationActiveLink link={link}>{link.name}</NavigationActiveLink>
            </NavigationMenuItem>
          ))}

          {isUserLoggedIn &&
            userLinks.map(link => (
              <NavigationMenuItem key={link.name}>
                <NavigationActiveLink link={link}>{link.name}</NavigationActiveLink>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu className="mr-3 ml-auto">
        {isUserLoggedIn ? (
          <SignedIn>
            <div data-testid="user-avatar" className="size-7">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        ) : (
          <Fragment>
            <div className="flex items-center gap-2">
              <SignInButton>
                <Button variant="link">{t("signin")}</Button>
              </SignInButton>

              <div className="border-primary h-6 border-l-2"></div>

              <SignUpButton>
                <Button variant="link">{t("signup")}</Button>
              </SignUpButton>
            </div>
          </Fragment>
        )}
      </NavigationMenu>
    </div>
  );
}

export { NavbarDesktop };
