import { useTranslations } from "next-intl";

import { NavbarDesktop } from "@/app/components/navbar/navbar-desktop";
import { NavbarMobile } from "@/app/components/navbar/navbar-mobile";

import type { NavbarLinks } from "@/types/common";

function Navbar() {
  const t = useTranslations("Navbar");
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

  return (
    <header>
      <div className="md:hidden">
        <NavbarMobile linksList={linksList} t={t} />
      </div>
      <div className="hidden md:block">
        <NavbarDesktop linksList={linksList} t={t} />
      </div>
    </header>
  );
}

export { Navbar };
