import Link from "next/link";
import { useTranslations } from "next-intl";

import { ChangeLocationSelector } from "@/app/components/change-location-selector";
import { ChangeThemeSelector } from "@/app/components/change-theme-selector";

type FooterProps = {
  locate?: string;
};
function Footer({ locate }: FooterProps) {
  const t = useTranslations("Footer");
  return (
    <footer className="mt-auto border-t border-neutral-300 h-13 flex items-center justify-between">
      <div className="text-sm text-gray-500">{t("copyright")}</div>
      <div className="text-sm text-gray-500 flex gap-4">
        <ChangeThemeSelector />
        <ChangeLocationSelector locate={locate} />
        <Link href="/disclaimer">
          <span className="text-blue-500 hover:underline">{t("disclaimer")}</span>
        </Link>
      </div>
    </footer>
  );
}

export { Footer };
