import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";

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
  t: (key: string) => string;
  locate?: string;
};

function NavbarMobile({ t, linksList, locate }: NavbarMobileProps) {
  return (
    <Dialog>
      <div className="border-primary flex items-center gap-4 rounded border-2 py-2">
        <Button asChild variant="link" className="font-bold">
          <Link href="/">{t("logo")}</Link>
        </Button>

        <DialogTrigger asChild>
          <Button className="ml-auto" variant="link">
            <Menu />
          </Button>
        </DialogTrigger>

        <DialogContent className="top-0 right-0 bottom-0 left-auto h-full translate-none rounded-none">
          <div className="flex flex-col">
            <DialogHeader className="mb-4 text-left">
              <DialogTitle>{t("logo")}</DialogTitle>
            </DialogHeader>

            <div className="divide-y-2 divide-gray-100">
              <SignedIn>
                {linksList.map(link => (
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
                    <a className="block cursor-pointer py-2">{t("signout")}</a>
                  </SignOutButton>
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <DialogClose asChild>
                    <a className="block py-2">{t("signin")}</a>
                  </DialogClose>
                </SignInButton>
                <SignUpButton>
                  <DialogClose asChild>
                    <a className="block py-2">{t("signup")}</a>
                  </DialogClose>
                </SignUpButton>
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
