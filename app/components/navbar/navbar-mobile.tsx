"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { ChangeLocationSelector } from "@/app/components/change-location-selector";
import { ChangeThemeSelector } from "@/app/components/change-theme-selector";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/app/components/ui/dialog";

import type { NavbarLinks } from "@/types/common";

type NavbarMobileProps = {
  linksList: NavbarLinks;
  userLinks: NavbarLinks;
  locate?: string;
};

function NavbarMobile({ linksList, userLinks, locate }: NavbarMobileProps) {
  const t = useTranslations("Navbar");
  return (
    <Dialog>
      <div className="border-primary flex items-center gap-4 rounded border-2 py-2">
        <Button asChild variant="link" className="font-bold">
          <Link href="/">{t("logo")}</Link>
        </Button>

        <DialogTrigger asChild>
          <Button className="ml-auto" variant="link" aria-label={t("menu")}>
            <Menu />
          </Button>
        </DialogTrigger>

        <DialogContent className="top-0 right-0 bottom-0 left-auto h-full translate-0 rounded-none">
          <div className="flex flex-col">
            <DialogHeader className="mb-4 text-left">
              <DialogTitle>{t("logo")}</DialogTitle>
            </DialogHeader>

            <div className="divide-y-2 divide-gray-100">
              {linksList.map(link => (
                <div key={link.name}>
                  <DialogClose asChild>
                    <Link href={link.url} className="block py-2">
                      {link.name}
                    </Link>
                  </DialogClose>
                </div>
              ))}

              <SignedIn>
                {userLinks.map(link => (
                  <div key={link.name}>
                    <DialogClose asChild>
                      <Link href={link.url} className="block py-2">
                        {link.name}
                      </Link>
                    </DialogClose>
                  </div>
                ))}
                <div>
                  <SignOutButton>
                    <DialogClose asChild>
                      <button className="block cursor-pointer py-2">{t("signout")}</button>
                    </DialogClose>
                  </SignOutButton>
                </div>
              </SignedIn>

              <SignedOut>
                <div>
                  <SignInButton>
                    <DialogClose asChild>
                      <button className="block py-2">{t("signin")}</button>
                    </DialogClose>
                  </SignInButton>
                </div>

                <div>
                  <SignUpButton>
                    <DialogClose asChild>
                      <button className="block py-2">{t("signup")}</button>
                    </DialogClose>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>

            <div className="mt-auto flex gap-4">
              <ChangeThemeSelector />

              <ChangeLocationSelector locate={locate} />
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export { NavbarMobile };
