"use client";

import { NumericFormat } from "react-number-format";
import cn from "classnames";
import type { GoodDiffChanges as GoodDiffChangesType } from "@/types/diff";
import type { Goods as GoodsType } from "@/types/pricelist";

type PriceListGoodsDiffProps = {
  diff: GoodDiffChangesType;
  goods: GoodsType;
};

export default function PriceListGoodsDiff({ diff, goods }: PriceListGoodsDiffProps) {
  return (
    <div>
      <NumericFormat
        value={diff.price}
        displayType="text"
        thousandSeparator=" "
        suffix=" ₽"
        renderText={value => <div className="pricelist_price">{value}</div>}
      />
      <div
        className={cn("pricelist_prices", {
          "-fixHeight": goods.priceOld || goods.profit
        })}
      >
        <NumericFormat
          value={diff.priceOld}
          displayType="text"
          thousandSeparator=" "
          suffix=" ₽"
          renderText={value => <span className="pricelist_oldPrice">{value}</span>}
        />
        <NumericFormat
          value={diff.profit}
          displayType="text"
          thousandSeparator=" "
          suffix=" ₽)"
          prefix="("
          renderText={value => <span className="pricelist_profit">{value}</span>}
        />
      </div>
    </div>
  );
}
