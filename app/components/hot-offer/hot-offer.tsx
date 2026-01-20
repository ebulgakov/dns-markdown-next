"use client";

import Image from "next/image";
import Link from "next/link";
import { NumericFormat } from "react-number-format";

import { sendGAEvent } from "@/app/lib/sendGAEvent";

import type { Goods } from "@/types/pricelist";

type HotOfferProps = {
  goods: Goods;
};

function HotOffer({ goods }: HotOfferProps) {
  const handleSendGAEvent = (event: string) => {
    sendGAEvent({
      event,
      value: goods.title,
      category: "HotOffer",
      action: "click"
    });
  };

  return (
    <div data-testid="offer-goods" className="space-y-4">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://dns-shop.ru${goods.link}`}
        className="mb-4 flex h-60 w-full items-center justify-center rounded bg-white dark:opacity-70"
        onClick={() => handleSendGAEvent("hot_offer_click")}
      >
        <Image
          src={goods.image}
          alt={`Превью для ${goods.title}`}
          className="block h-auto max-h-full w-auto max-w-full"
          width={200}
          height={200}
        />
      </a>
      <div className="text-base">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://dns-shop.ru${goods.link}`}
          className="text-primary break-all md:break-normal"
          onClick={() => handleSendGAEvent("hot_offer_title_click")}
        >
          {goods.title}
        </a>
        &nbsp;
        <small className="text-[75%] leading-none font-normal whitespace-nowrap text-[#777777]">
          {goods.code}
        </small>
      </div>

      <div className="mb-3">{goods.description}</div>

      <div className="">
        {goods.reasons && (
          <div>
            {goods.reasons.map(reason => (
              <dl className="mr-2.5 inline-block" key={reason._id}>
                <dt className="mr-1 inline font-normal opacity-40">{reason.label}</dt>
                <dd className="inline">{reason.text}</dd>
              </dl>
            ))}
          </div>
        )}
      </div>

      <div className="">
        <div className="flex items-baseline gap-2">
          <NumericFormat
            value={goods.price}
            displayType="text"
            thousandSeparator=" "
            suffix=" ₽"
            renderText={value => (
              <div className="h-7 text-xl font-semibold whitespace-nowrap">{value}</div>
            )}
          />

          <NumericFormat
            value={goods.priceOld}
            displayType="text"
            thousandSeparator=" "
            suffix=" ₽"
            renderText={value => <span className="line-through">{value}</span>}
          />

          <NumericFormat
            value={goods.profit}
            displayType="text"
            thousandSeparator=" "
            prefix="("
            suffix=" ₽)"
          />
        </div>

        <Link
          className="text-primary text-lg"
          href={goods.link}
          onClick={() => handleSendGAEvent("hot_offer_price_analysis")}
        >
          Анализ цены
        </Link>
      </div>
    </div>
  );
}
export { HotOffer };
