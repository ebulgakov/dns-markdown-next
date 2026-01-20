import { useTranslations } from "next-intl";

import { NavbarDesktop } from "@/app/components/navbar/navbar-desktop";
import { NavbarMobile } from "@/app/components/navbar/navbar-mobile";

import type { NavbarLinks } from "@/types/common";

type NavbarProps = {
  locate?: string;
  city?: string;
  isUserLoggedIn?: boolean;
};

function Navbar({ locate, isUserLoggedIn, city }: NavbarProps) {
  const t = useTranslations("Navbar");
  const aboutT = useTranslations("About");
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
      name: t("analysis"),
      url: "/analysis"
    }
  ];

  const userLinks: NavbarLinks = [
    {
      name: t("favorites"),
      url: "/favorites"
    },
    {
      name: t("profile"),
      url: "/profile"
    }
  ];

  const mobileNavbar = [...linksList, { name: aboutT("link"), url: "/about" }];

  return (
    <header>
      <div className="md:hidden">
        <NavbarMobile
          isUserLoggedIn={isUserLoggedIn}
          linksList={mobileNavbar}
          userLinks={userLinks}
          locate={locate}
          city={city}
        />
      </div>
      <div className="hidden md:block">
        <NavbarDesktop
          isUserLoggedIn={isUserLoggedIn}
          linksList={linksList}
          userLinks={userLinks}
          city={city}
        />
      </div>
    </header>
  );
}

export { Navbar };
