"use client";
import { NumericFormat } from "react-number-format";
import type { GoodDiffChanges as GoodDiffChangesType } from "@/types/diff";

type PriceListGoodsDiffProps = {
  diff: GoodDiffChangesType;
};

function PriceListGoodsDiff({ diff }: PriceListGoodsDiffProps) {
  return (
    <div className="text-center basis-37 opacity-40">
      <NumericFormat
        value={diff.price}
        displayType="text"
        thousandSeparator=" "
        suffix=" ₽"
        renderText={value => (
          <div className="text-xl h-7 font-semibold whitespace-nowrap">{value}</div>
        )}
      />
      <div className="flex gap-2 text-sm justify-center mb-6">
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
