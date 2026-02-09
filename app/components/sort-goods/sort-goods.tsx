"use client";
import { Info } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/app/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";

import type { SortGoodsOptions } from "@/types/common";

function SortGoods() {
  const onChange = useSortGoodsStore(state => state.updateSortGoods);
  const sortGoods = useSortGoodsStore(state => state.sortGoods);

  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger>
          <Info />
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>
            <b>По умолчанию</b>&nbsp;&mdash; как товары представлены на сайте
          </p>
          <p>
            <b>По цене</b>&nbsp;&mdash; от самого дешёвого до дорогого товара
          </p>
          <p>
            <b>По размеру скидки</b>&nbsp;&mdash; по размеру скидки в %
          </p>
          <p>
            <b>По максимальной выгоде</b>&nbsp;&mdash; по максимальной выгоде в рублях
          </p>
        </TooltipContent>
      </Tooltip>
      <Select onValueChange={(e: SortGoodsOptions) => onChange(e)} value={sortGoods}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Сортировка" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Сортировка</SelectLabel>
            <SelectItem value="default">По умолчанию</SelectItem>
            <SelectItem value="price">По цене</SelectItem>
            <SelectItem value="discount">По размеру скидки</SelectItem>
            <SelectItem value="profit">По максимальной выгоде</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export { SortGoods };
