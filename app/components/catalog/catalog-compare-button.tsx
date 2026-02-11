import { Square, SquareCheckBig } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { useLlmStore } from "@/app/stores/llm-store";
import { VisualizationGoods } from "@/types/visualization";

type CatalogCompareButtonProps = {
  item: VisualizationGoods;
};
function CatalogCompareButton({ item }: CatalogCompareButtonProps) {
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
      isAvailableCompare: state.isAvailableCompare,
      updateCompareGoodsLinks: state.updateCompareGoodsLinks,
      isReportLoading: state.isReportLoading,
      compareGoods: state.compareGoods,
      describeGoods: state.describeGoods
    }))
  );

  const isInCompare = compareGoodsLinks.some(link => link.link === item.link);
  const isEqualTitles = compareGoodsLinks.every(link => link.sectionTitle === item.sectionTitle);

  const comparePayload = {
    link: item.link,
    sectionTitle: item.sectionTitle
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
    <div className="relative h-full">
      {isInCompare && (
        <div className="bg-background absolute inset-0 flex items-center justify-end">
          <Button disabled={isReportLoading} className="mr-10" onClick={handleClickCompare}>
            {compareGoodsLinks.length < 2 ? "Получить описание" : "Стравнить"}
          </Button>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleChangeCompare}
              disabled={compareGoodsLinks.length >= 3 && isEqualTitles && !isInCompare}
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isInCompare ? (
                <SquareCheckBig className="text-success" />
              ) : (
                <Square className="text-primary" />
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
                {isInCompare
                  ? "Убрать из сравнения"
                  : "Добавить товар в сравнение (макс. 3 товара)"}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export { CatalogCompareButton };
