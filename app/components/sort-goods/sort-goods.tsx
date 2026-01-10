"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/app/components/ui/select";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";

import type { SortGoodsOptions } from "@/types/common";

function SortGoods() {
  const onChange = useSortGoodsStore(state => state.updateSortGoods);
  const sortGoods = useSortGoodsStore(state => state.sortGoods);

  return (
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
  );
}

export { SortGoods };
