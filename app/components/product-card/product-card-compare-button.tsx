import { Square, SquareCheckBig } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { useLlmStore } from "@/app/stores/llm-store";

import type { Goods as GoodsType } from "@/types/pricelist";

type ProductCardCompareButtonProps = {
  item: GoodsType;
  sectionTitle: string;
};
function ProductCardCompareButton({ item, sectionTitle }: ProductCardCompareButtonProps) {
  const {
    compareGoodsLinks,
    updateCompareGoodsLinks,
    setCompareGoodsLinks,
    compareGoods,
    describeGoods,
    isReportLoading
  } = useLlmStore(
    useShallow(state => ({
      setCompareGoodsLinks: state.setCompareGoodsLinks,
      compareGoodsLinks: state.compareGoodsLinks,
      updateCompareGoodsLinks: state.updateCompareGoodsLinks,
      isReportLoading: state.isReportLoading,
      compareGoods: state.compareGoods,
      describeGoods: state.describeGoods
    }))
  );

  const isInCompare = compareGoodsLinks.some(link => link.link === item.link);
  const isEqualTitles = compareGoodsLinks.every(link => link.sectionTitle === sectionTitle);

  const comparePayload = {
    link: item.link,
    sectionTitle: sectionTitle
  };

  const handleChangeCompare = () => {
    if (!isEqualTitles) {
      setCompareGoodsLinks([comparePayload]);
    } else {
      updateCompareGoodsLinks(comparePayload);
    }
  };

  const handleClickCompare = async () => {
    if (compareGoodsLinks.length < 2) {
      await describeGoods(comparePayload);
    } else {
      await compareGoods(compareGoodsLinks);
    }
  };

  return (
    <div className="relative">
      {isInCompare && (
        <div className="bg-background absolute -top-1 left-10 rounded-md md:right-10 md:left-auto">
          <Button disabled={isReportLoading} onClick={handleClickCompare}>
            {isReportLoading
              ? "Ждём ответ от ChatGPT"
              : compareGoodsLinks.length < 2
                ? "Получить описание"
                : "Сравнить"}
          </Button>
        </div>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleChangeCompare}
            disabled={compareGoodsLinks.length > 5 && isEqualTitles && !isInCompare}
            className="relative block cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isInCompare ? (
              <SquareCheckBig className="text-success block" />
            ) : (
              <Square className="text-primary block" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {compareGoodsLinks.length < 2 ? (
            <p>
              {isInCompare
                ? "Убрать отметку"
                : "Получить описание товара или добавить товар в сравнение"}
            </p>
          ) : (
            <p>
              {isInCompare ? "Убрать из сравнения" : "Добавить товар в сравнение (макс. 5 товаров)"}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export { ProductCardCompareButton };
