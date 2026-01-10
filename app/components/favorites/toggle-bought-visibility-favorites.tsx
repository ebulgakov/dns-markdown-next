"use client";

import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";

type ToggleBoughtVisibilityFavoritesProps = {
  shownBoughtFavorites: boolean;
  onChangeVisibility: (status: boolean) => void;
};

function ToggleBoughtVisibilityFavorites({
  shownBoughtFavorites,
  onChangeVisibility
}: ToggleBoughtVisibilityFavoritesProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={shownBoughtFavorites}
        id="show-bought-favorites-checkbox"
        onCheckedChange={() => onChangeVisibility(!shownBoughtFavorites)}
      />

      <Label htmlFor="show-bought-favorites-checkbox" className="cursor-pointer">
        Показать купленные товары
      </Label>
    </div>
  );
}

export { ToggleBoughtVisibilityFavorites };
