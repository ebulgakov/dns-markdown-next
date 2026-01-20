"use client";

import { SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

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
import { sendGAEvent } from "@/app/lib/sendGAEvent";

import type { NavbarLinks } from "@/types/common";

type NavbarMobileProps = {
  linksList: NavbarLinks;
  userLinks: NavbarLinks;
  isUserLoggedIn?: boolean;
  locate?: string;
  city?: string;
};

function NavbarMobile({ linksList, userLinks, isUserLoggedIn, locate, city }: NavbarMobileProps) {
  const t = useTranslations("Navbar");
  const cities = useTranslations("cities");

  const handleSendGAEvent = (link: { name: string; url: string }) => {
    sendGAEvent({
      event: "mobile_navbar_user_click",
      value: link.name,
      category: "Navbar",
      action: "click"
    });
  };
  return (
    <Dialog>
      <div className="border-primary flex items-center gap-4 rounded border-2 py-2">
        <Button asChild variant="link" className="font-bold">
          <Link href="/" onClick={() => handleSendGAEvent({ name: "home", url: "/" })}>
            {t("logo")} {city ? cities(city) : ""}
          </Link>
        </Button>

        <DialogTrigger asChild>
          <Button className="ml-auto" variant="link" aria-label={t("menu")}>
            <Menu />
          </Button>
        </DialogTrigger>

        <DialogContent
          data-testid="mobile-navbar-user"
          className="top-0 right-0 bottom-0 left-auto h-full translate-0 rounded-none"
        >
          <div className="flex flex-col">
            <DialogHeader className="mb-4 text-left">
              <DialogTitle>{t("logo")}</DialogTitle>
            </DialogHeader>

            <div className="divide-y-2 divide-gray-100">
              {linksList.map(link => (
                <div key={link.name}>
                  <DialogClose asChild>
                    <Link
                      href={link.url}
                      className="block py-2"
                      onClick={() => handleSendGAEvent(link)}
                    >
                      {link.name}
                    </Link>
                  </DialogClose>
                </div>
              ))}

              {isUserLoggedIn ? (
                <Fragment>
                  {userLinks.map(link => (
                    <div key={link.name}>
                      <DialogClose asChild>
                        <Link
                          href={link.url}
                          className="block py-2"
                          onClick={() => handleSendGAEvent(link)}
                        >
                          {link.name}
                        </Link>
                      </DialogClose>
                    </div>
                  ))}
                  <div>
                    <SignOutButton>
                      <DialogClose asChild>
                        <button
                          className="block cursor-pointer py-2"
                          onClick={() =>
                            handleSendGAEvent({
                              name: "signout",
                              url: "/signout"
                            })
                          }
                        >
                          {t("signout")}
                        </button>
                      </DialogClose>
                    </SignOutButton>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div>
                    <SignInButton>
                      <DialogClose asChild>
                        <button
                          className="block py-2"
                          onClick={() =>
                            handleSendGAEvent({
                              name: "signin",
                              url: "/signin"
                            })
                          }
                        >
                          {t("signin")}
                        </button>
                      </DialogClose>
                    </SignInButton>
                  </div>

                  <div>
                    <SignUpButton>
                      <DialogClose asChild>
                        <button
                          className="block py-2"
                          onClick={() =>
                            handleSendGAEvent({
                              name: "signup",
                              url: "/signup"
                            })
                          }
                        >
                          {t("signup")}
                        </button>
                      </DialogClose>
                    </SignUpButton>
                  </div>
                </Fragment>
              )}
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
