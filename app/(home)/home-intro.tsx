"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { MoreLink } from "@/app/components/more-link";
import { PageTitle } from "@/app/components/ui/page-title";
import { sendGAEvent } from "@/app/lib/sendGAEvent";

export function HomeIntro() {
  const t = useTranslations("HomePage");
  const tAbout = useTranslations("About");
  const handleSendGAEvent = () => {
    sendGAEvent({
      event: "more_click",
      value: tAbout("title"),
      category: "HomePage",
      action: "click"
    });
  };
  return (
    <Fragment>
      <PageTitle title={t("title")} />
      <div className="space-y-4">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {t.markup("text", {
            lead: chunks => `<p class="text-xl">${chunks}</p>`,
            border: chunks =>
              `<p class="border border-gray-200 shadow-sm my-4 px-5 py-2 rounded-sm">${chunks}</p>`
          })}
        </ReactMarkdown>
      </div>

      <MoreLink icon={Info}>
        {t("view_more")}&nbsp;
        <Link href="/about" className="text-primary" onClick={handleSendGAEvent}>
          {tAbout("title")}
        </Link>
        .
      </MoreLink>
    </Fragment>
  );
}
