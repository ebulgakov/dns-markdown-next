import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

function CatalogFavoritesEmptyAlert() {
  return (
    <Alert variant="success">
      <AlertTitle>У вас нет избранных категорий</AlertTitle>
      <AlertDescription>
        Добавьте избранные категории с помощью сердечка напротив заголовка и они всегда будут
        закреплены вверху списка
      </AlertDescription>
    </Alert>
  );
}

export { CatalogFavoritesEmptyAlert };
