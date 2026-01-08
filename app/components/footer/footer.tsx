import Link from "next/link";
import { ChangeLocationSelector } from "@/app/components/change-location-selector";
import { useTranslations } from "next-intl";

type FooterProps = {
  locate?: string;
};
function Footer({ locate }: FooterProps) {
  const t = useTranslations("Footer");
  return (
    <footer className="mt-auto border-t border-neutral-300 h-13 flex items-center justify-between">
      <div className="text-sm text-gray-500">{t("copyright")}</div>
      <div className="text-sm text-gray-500 flex gap-4">
        <ChangeLocationSelector locate={locate} />
        <Link href="/disclaimer">
          <span className="text-blue-500 hover:underline">{t("disclaimer")}</span>
        </Link>
      </div>
    </footer>
  );
}

export { Footer };
