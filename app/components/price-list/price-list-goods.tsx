"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { NumericFormat } from "react-number-format";

import { PriceListFavoriteToggle } from "./price-list-favorite-toggle";
import { PriceListGoodsDiff } from "./price-list-goods-diff";

import type { GoodDiffChanges as GoodDiffChangesType } from "@/types/diff";
import type { Goods as GoodsType } from "@/types/pricelist";
import type { Favorite, FavoriteStatus } from "@/types/user";
import { formatDate } from "@/app/helpers/format";

type PriceListGoodsProps = {
  item: GoodsType;
  diff?: GoodDiffChangesType;
  favorites?: Favorite[];
  status?: FavoriteStatus;
};
function PriceListGoods({ item, status, diff, favorites }: PriceListGoodsProps) {
  return (
    <div
      className={clsx("flex items-center gap-4 py-1", {
        "opacity-40": status?.deleted
      })}
    >
      <div className="isolate flex h-55 flex-none basis-55 items-center justify-center gap-5 rounded bg-white dark:opacity-70">
        <Image
          src={item.image}
          alt={`Превью для ${item.title}`}
          className="block h-auto max-h-full w-auto max-w-full"
          width={200}
          height={200}
        />
      </div>
      <div className="flex-1">
        <div className="mb-2.5 text-base">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`http://dns-shop.ru${item.link}`}
            className="text-[#337ab7]"
          >
            {item.title}
          </a>
          &nbsp;
          <small className="text-[75%] leading-none font-normal text-[#777777]">{item.code}</small>
        </div>
        <p className="mb-3">{item.description}</p>
        {item.reasons && (
          <div>
            {item.reasons.map(reason => (
              <dl className="mr-2.5 inline-block" key={reason._id}>
                <dt className="mr-1 inline font-normal opacity-40">{reason.label}</dt>
                <dd className="inline">{reason.text}</dd>
              </dl>
            ))}
          </div>
        )}

        {status?.createdAt && (
          <div className="mt-2 text-sm text-gray-500">
            Добавлен: {formatDate(status?.createdAt)}
          </div>
        )}
      </div>

      {diff && <PriceListGoodsDiff diff={diff} />}

      <div className="basis-37 text-center">
        <NumericFormat
          value={item.price}
          displayType="text"
          thousandSeparator=" "
          suffix=" ₽"
          renderText={value => (
            <div className="h-7 text-xl font-semibold whitespace-nowrap">{value}</div>
          )}
        />
        <div className="flex justify-center gap-2 text-sm">
          <NumericFormat
            value={item.priceOld}
            displayType="text"
            thousandSeparator=" "
            suffix=" ₽"
            renderText={value => <span className="line-through">{value}</span>}
          />
          <NumericFormat
            value={item.profit}
            displayType="text"
            thousandSeparator=" "
            prefix="("
            suffix=" ₽)"
          />
        </div>
        {status?.deleted && status?.updatedAt ? (
          <div className="pricelist_bought">
            Куплен {new Date(status.updatedAt).toLocaleDateString()}
          </div>
        ) : (
          <>
            {item.link && (
              <Link className="text-[#337ab7]" href={item.link}>
                Анализ цены
              </Link>
            )}
          </>
        )}
      </div>
      <div className="flex-none">{item.available}</div>

      {favorites && <PriceListFavoriteToggle favorites={favorites} goods={item} />}
    </div>
  );
}

export { PriceListGoods };
