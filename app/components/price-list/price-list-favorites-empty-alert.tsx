import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

type PriceListFavoritesEmptyAlertProps = {
  isUserLoggedIn?: boolean;
};
function PriceListFavoritesEmptyAlert({ isUserLoggedIn }: PriceListFavoritesEmptyAlertProps) {
  const text = isUserLoggedIn
    ? "Добавьте избранные категории с помощью сердечка напротив заголовка или в вашем профиле и они всегда будут закреплены вверху списка"
    : "Добавьте избранные категории с помощью сердечка напротив заголовка и они всегда будут закреплены вверху списка";
  return (
    <div className="mb-10">
      <Alert variant="success">
        <AlertTitle>У вас нет избранных категорий</AlertTitle>
        <AlertDescription>{text}</AlertDescription>
      </Alert>
    </div>
  );
}

export { PriceListFavoritesEmptyAlert };
