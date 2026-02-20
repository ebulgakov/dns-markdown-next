import { Star } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

function FavoritesEmptyAlert() {
  return (
    <Alert>
      <AlertTitle>Избранное пусто</AlertTitle>
      <AlertDescription data-testid="favorites-empty-message">
        <div>
          Добавьте товары в избранное (<Star className="text-favorite inline-block" />
          ), чтобы они отобразились здесь.
        </div>
      </AlertDescription>
    </Alert>
  );
}

export { FavoritesEmptyAlert };
