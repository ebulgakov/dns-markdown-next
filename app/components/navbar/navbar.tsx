import { useTranslations } from "next-intl";

import { NavbarDesktop } from "@/app/components/navbar/navbar-desktop";
import { NavbarMobile } from "@/app/components/navbar/navbar-mobile";

import type { NavbarLinks } from "@/types/common";

type NavbarProps = {
  locate?: string;
};

function Navbar({ locate }: NavbarProps) {
  const t = useTranslations("Navbar");
  // TODO: add in the future a new section and name it Disclaimer
  const disclaimerT = useTranslations("Footer");
  const linksList: NavbarLinks = [
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

  const mobileNavbar = [...linksList, { name: disclaimerT("disclaimer"), url: "/disclaimer" }];

  return (
    <header>
      <div className="md:hidden">
        <NavbarMobile linksList={mobileNavbar} locate={locate} />
      </div>
      <div className="hidden md:block">
        <NavbarDesktop linksList={linksList} />
      </div>
    </header>
  );
}

export { Navbar };
