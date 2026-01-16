"use client";
import { NumericFormat } from "react-number-format";

import type { Diff as DiffType } from "@/types/analysis-diff";

type PriceListGoodsDiffProps = {
  diff: DiffType;
};

function PriceListGoodsDiff({ diff }: PriceListGoodsDiffProps) {
  return (
    <div className="text-center opacity-40">
      <NumericFormat
        value={diff.price}
        displayType="text"
        thousandSeparator=" "
        suffix=" ₽"
        renderText={value => (
          <div className="h-7 text-xl font-semibold whitespace-nowrap">{value}</div>
        )}
      />
      <div className="flex justify-center gap-2 text-sm md:mb-6">
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
