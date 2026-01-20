"use client";

import { ChartBar } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import { HotOffer } from "@/app/components/hot-offer";
import { MoreLink } from "@/app/components/more-link";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Title } from "@/app/components/ui/title";
import { sendGAEvent } from "@/app/lib/sendGAEvent";

import type { CustomDate } from "@/types/common";
import type { Goods } from "@/types/pricelist";

type HomeUpdatesProps = {
  city?: string;
  date?: CustomDate;
  mostProfitable?: Goods;
  mostDiscounted?: Goods;
  mostCheap?: Goods;
  error?: Error;
};

function EmptyOffer() {
  return <>-</>;
}

export default function HomeUpdates({
  date,
  mostProfitable,
  mostDiscounted,
  city,
  mostCheap,
  error
}: HomeUpdatesProps) {
  const t = useTranslations("HomePage");
  const tNav = useTranslations("Navbar");
  const cities = useTranslations("cities");

  if (error || !date || !city) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>{t("error_title")}</AlertTitle>
        <AlertDescription>{error?.message || t("error_text")}</AlertDescription>
      </Alert>
    );
  }

  const handleSendGAEvent = () => {
    sendGAEvent({
      event: "more_click",
      value: tNav("analysis"),
      category: "HomePage",
      action: "click"
    });
  };

  return (
    <Fragment>
      <Title variant="h2">
        {t("most_title")} {cities(city)}
      </Title>

      <div className="grid gap-x-8 gap-y-2 md:grid-cols-[repeat(2,_1fr)] lg:grid-cols-[repeat(3,_1fr)]">
        <div>
          <Title variant="h3">{t("most_cheap")}</Title>

          {mostCheap ? (
            <Fragment>
              <p className="mb-2">
                <b>{mostCheap.price}&nbsp;₽</b> &mdash; {t("most_cheap_text")}.
              </p>
              <HotOffer goods={mostCheap} />
            </Fragment>
          ) : (
            <EmptyOffer />
          )}
        </div>
        <div>
          <Title variant="h3">{t("most_discount")}</Title>

          {mostDiscounted ? (
            <Fragment>
              <p className="mb-2">
                <b>
                  {parseInt(
                    String(
                      100 - (Number(mostDiscounted.price) * 100) / Number(mostDiscounted.priceOld)
                    ),
                    10
                  )}
                  %
                </b>
                &nbsp;&mdash; {t("most_discount_text")}.
              </p>
              <HotOffer goods={mostDiscounted} />
            </Fragment>
          ) : (
            <EmptyOffer />
          )}
        </div>
        <div>
          <Title variant="h3">{t("most_profit")}</Title>
          {mostProfitable ? (
            <Fragment>
              <p className="mb-2">
                <b>{mostProfitable.profit}&nbsp;₽</b> &mdash; {t("most_profit_text")}.
              </p>
              <HotOffer goods={mostProfitable} />
            </Fragment>
          ) : (
            <EmptyOffer />
          )}
        </div>
      </div>

      <MoreLink icon={ChartBar}>
        {t("view_more")}&nbsp;
        <Link href="/analysis" className="text-primary" onClick={handleSendGAEvent}>
          {tNav("analysis")}
        </Link>
        .
      </MoreLink>
    </Fragment>
  );
}
