import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useContext, startTransition } from "react";

import { postChangeUserCity } from "@/api/post";
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
  const router = useRouter();
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

  const handleChangeCity = async (newCity: string) => {
    await postChangeUserCity(newCity);
    startTransition(async () => {
      try {
        await postChangeUserCity(newCity);
        sendGAEvent({
          event: "change_city",
          value: newCity,
          category: "Navbar",
          action: "click"
        });
        router.refresh();
      } catch (error) {
        console.error("Failed to change city:", error);
      }
    });
    sendGAEvent({
      event: "change_city",
      value: newCity,
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
            <DropdownMenuCheckboxItem
              checked={city === "samara"}
              disabled={city === "samara"}
              onCheckedChange={() => handleChangeCity("samara")}
            >
              {cities("samara")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={city === "moscow"}
              disabled={city === "moscow"}
              onCheckedChange={() => handleChangeCity("moscow")}
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
