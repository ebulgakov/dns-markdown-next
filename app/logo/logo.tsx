import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useContext } from "react";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from "@/app/components/ui/dropdown-menu";
import { UserContext } from "@/app/contexts/user-context";
import { sendGAEvent } from "@/app/lib/sendGAEvent";

function Logo() {
  const { city } = useContext(UserContext);
  const t = useTranslations("Navbar");
  const cities = useTranslations("cities");

  const handleSendGAEvent = (link: { name: string; url: string }) => {
    sendGAEvent({
      event: "logo_click",
      value: link.name,
      category: "Navbar",
      action: "click"
    });
  };

  return (
    <div>
      <Button asChild variant="link" className="cursor-pointer">
        <Link href="/" onClick={() => handleSendGAEvent({ name: "home", url: "/" })}>
          {t("logo")}
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" className="-ml-4 cursor-pointer font-bold">
            {city ? cities(city) : ""}
            <ChevronDown className="text-secondary -m-1 size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("change_city")}</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={city === "samara"} onCheckedChange={() => {}}>
              {cities("samara")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={city === "moscow"}
              onCheckedChange={() => {}}
              disabled
            >
              {cities("moscow")}
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { Logo };
