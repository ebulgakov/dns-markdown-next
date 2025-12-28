import type { Goods as GoodsType } from "@/types/pricelist";

type PriceListGoodsType = {
  goods: GoodsType
};
export default function PriceListGoods({ goods }: PriceListGoodsType) {
  return <div>{JSON.stringify(goods, null, 2)}</div>;
}
