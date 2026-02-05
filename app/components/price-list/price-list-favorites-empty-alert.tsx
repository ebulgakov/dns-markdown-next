import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

function PriceListFavoritesEmptyAlert() {
  return (
    <div className="mb-10">
      <Alert variant="success">
        <AlertTitle>У вас нет избранных категорий</AlertTitle>
        <AlertDescription>
          Добавьте избранные категории с помощью сердечка напротив заголовка и они всегда будут
          закреплены вверху списка
        </AlertDescription>
      </Alert>
    </div>
  );
}

export { PriceListFavoritesEmptyAlert };
