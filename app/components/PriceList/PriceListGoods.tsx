import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { NumericFormat } from "react-number-format";
import type { Goods as GoodsType } from "@/types/pricelist";
import type { GoodDiffChanges as GoodDiffChangesType } from "@/types/diff";
import type { Favorite, FavoriteStatus } from "@/types/user";
import PriceListFavoriteToggle from "@/app/components/PriceList/PriceListFavoriteToggle";
import PriceListGoodsDiff from "@/app/components/PriceList/PriceListGoodsDiff";

type PriceListGoodsType = {
  item: GoodsType;
  diff?: GoodDiffChangesType;
  favorites?: Favorite[];
  status?: FavoriteStatus;
};
export default function PriceListGoods({ item, status, diff, favorites = [] }: PriceListGoodsType) {
  // Placeholders
  const hideFavorites = false;

  return (
    <div
      className={cn("flex items-center gap-4 py-1", {
        "opacity-40": status?.deleted
      })}
    >
      <div className="flex-none basis-55 h-55 gap-5 flex items-center text-center">
        <Image src={item.image} alt="" width={200} height={200} />
      </div>
      <div className="flex-1">
        <div className="text-base mb-2.5">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`http://dns-shop.ru${item.link}`}
            className="text-[#337ab7]"
          >
            {item.title}
          </a>
          &nbsp;
          <small className="text-[75%] font-normal leading-none text-[#777777]">{item.code}</small>
        </div>
        <p className="mb-3">{item.description}</p>
        {item.reasons && (
          <div>
            {item.reasons.map((reason, idx) => (
              <dl className="inline-block mr-2.5" key={idx}>
                <dt className="inline opacity-40 font-normal mr-1">{reason.label}</dt>
                <dd className="inline">{reason.text}</dd>
              </dl>
            ))}
          </div>
        )}
      </div>

      {diff && <PriceListGoodsDiff diff={diff} goods={item} />}

      <div className="text-center basis-37">
        <NumericFormat
          value={item.price}
          displayType="text"
          thousandSeparator=" "
          suffix=" ₽"
          renderText={value => (
            <div className="text-xl font-semibold whitespace-nowrap">{value}</div>
          )}
        />
        <div className="flex gap-2 text-sm justify-center">
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
            suffix=" ₽"
            renderText={value => <span>({value})</span>}
          />
        </div>
        {status && status.updatedAt ? (
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

      {!hideFavorites && <PriceListFavoriteToggle favorites={favorites} goods={item} />}
    </div>
  );
}
