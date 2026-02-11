import { Square, SquareCheckBig } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { useLlmStore } from "@/app/stores/llm-store";
import { VisualizationGoods } from "@/types/visualization";

type CatalogCompareButtonProps = {
  item: VisualizationGoods;
};
function CatalogCompareButton({ item }: CatalogCompareButtonProps) {
  const { compareGoodsLinks, toggleCompareGoodsLinks } = useLlmStore(
    useShallow(state => ({
      compareGoodsLinks: state.compareGoodsLinks,
      isAvailableCompare: state.isAvailableCompare,
      toggleCompareGoodsLinks: state.toggleCompareGoodsLinks
    }))
  );
  return (
    <div className="bg-background absolute top-0 right-0 h-full w-6">
      <div className="flex h-full items-center justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                toggleCompareGoodsLinks(item.link);
              }}
              disabled={compareGoodsLinks.length >= 3 && !compareGoodsLinks.includes(item.link)}
              className="disabled:cursor-not-allowed disabled:opacity-50"
            >
              {compareGoodsLinks.includes(item.link) ? (
                <SquareCheckBig className="text-success" />
              ) : (
                <Square className="text-primary" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {compareGoodsLinks.includes(item.link)
                ? "Убрать из сравнения"
                : "Добавить товар в сравнение (макс. 3 товара)"}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export { CatalogCompareButton };
