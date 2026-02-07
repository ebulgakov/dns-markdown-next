import { useTranslations } from "next-intl";

import { NavbarDesktop } from "@/app/components/navbar/navbar-desktop";
import { NavbarMobile } from "@/app/components/navbar/navbar-mobile";

import type { NavbarLinks } from "@/types/common";

type NavbarProps = {
  locate?: string;
  isUserLoggedIn?: boolean;
};

function Navbar({ locate, isUserLoggedIn }: NavbarProps) {
  const t = useTranslations("Navbar");
  const aboutT = useTranslations("About");
  const linksList: NavbarLinks = [
    {
      name: t("catalog"),
      url: "/catalog"
    },
    {
      name: t("updates"),
      url: "/today"
    },
    {
      name: t("analysis"),
      url: "/analysis"
    },
    {
      name: t("archive"),
      url: "/archive"
    },
    {
      name: t("favorites"),
      url: "/favorites"
    }
  ];

  const userLinks: NavbarLinks = [
    {
      name: t("profile"),
      url: "/profile"
    }
  ];

  const mobileNavbar = [...linksList, { name: aboutT("title"), url: "/about" }];

  return (
    <header className="bg-background sticky top-0 z-11 mt-4 mb-5">
      <div className="lg:hidden">
        <NavbarMobile
          isUserLoggedIn={isUserLoggedIn}
          linksList={mobileNavbar}
          userLinks={userLinks}
          locate={locate}
        />
      </div>
      <div className="hidden lg:block">
        <NavbarDesktop
          isUserLoggedIn={isUserLoggedIn}
          linksList={linksList}
          userLinks={userLinks}
        />
      </div>
    </header>
  );
}

export { Navbar };
