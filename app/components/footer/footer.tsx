import { Github } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { ChangeLocationSelector } from "@/app/components/change-location-selector";
import { ChangeThemeSelector } from "@/app/components/change-theme-selector";
import { version } from "@/lib/version";

type FooterProps = {
  locate?: string;
};

function Footer({ locate }: FooterProps) {
  const t = useTranslations("About");
  return (
    <footer className="mt-auto flex h-13 items-center justify-between border-t border-neutral-300">
      <div className="text-sm text-gray-500">
        2018–2026 V{version}&nbsp;
        <a
          href="https://github.com/ebulgakov/dns-markdown-next"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center justify-center gap-1"
        >
          <span className="underline">GitHub</span> <Github className="size-4" />
        </a>
      </div>
      <div className="hidden gap-4 text-sm text-gray-500 md:flex">
        <ChangeThemeSelector />
        <ChangeLocationSelector locate={locate} />
        <Link href="/about">
          <span className="text-blue-500 hover:underline">{t("title")}</span>
        </Link>
      </div>
    </footer>
  );
}

export { Footer };
