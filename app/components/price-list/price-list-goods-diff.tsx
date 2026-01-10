"use client";
import { NumericFormat } from "react-number-format";

import type { GoodDiffChanges as GoodDiffChangesType } from "@/types/diff";

type PriceListGoodsDiffProps = {
  diff: GoodDiffChangesType;
};

function PriceListGoodsDiff({ diff }: PriceListGoodsDiffProps) {
  return (
    <div className="basis-37 text-center opacity-40">
      <NumericFormat
        value={diff.price}
        displayType="text"
        thousandSeparator=" "
        suffix=" ₽"
        renderText={value => (
          <div className="h-7 text-xl font-semibold whitespace-nowrap">{value}</div>
        )}
      />
      <div className="mb-6 flex justify-center gap-2 text-sm">
        {diff.priceOld && (
          <NumericFormat
            value={diff.priceOld}
            displayType="text"
            thousandSeparator=" "
            suffix=" ₽"
            renderText={value => <span className="line-through">{value}</span>}
          />
        )}
        <NumericFormat
          value={diff.profit}
          displayType="text"
          thousandSeparator=" "
          prefix="("
          suffix=" ₽)"
        />
      </div>
    </div>
  );
}

export { PriceListGoodsDiff };
