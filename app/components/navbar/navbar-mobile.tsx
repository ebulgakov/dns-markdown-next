import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";

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
};

function NavbarMobile({ t, linksList }: NavbarMobileProps) {
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

            <div className="mt-auto">
              <SignedOut>
                <div className="flex items-center gap-2">
                  <div className="border-primary h-6 border-l-2"></div>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="size-7">
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export { NavbarMobile };
