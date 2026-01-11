import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/app/components/ui/button";
import { NavigationMenu } from "@/app/components/ui/navigation-menu";

import type { NavbarLinks } from "@/types/common";

type NavbarMobileProps = {
  linksList: NavbarLinks;
  t: (key: string) => string;
};

function NavbarMobile({ t, linksList }: NavbarMobileProps) {
  return (
    <div className="border-primary flex items-center gap-4 rounded border-2 py-2">
      <NavigationMenu>
        <Button asChild variant="link" className="font-bold">
          <Link href="/">{t("logo")}</Link>
        </Button>
      </NavigationMenu>

      <Button className="ml-auto" variant="link">
        <Menu />
      </Button>
    </div>
  );
}

export { NavbarMobile };
