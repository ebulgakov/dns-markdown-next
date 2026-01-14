import { Fragment } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

type PriceListFavoritesEmptyAlertProps = {
  isUserLoggedIn?: boolean;
};
function PriceListFavoritesEmptyAlert({ isUserLoggedIn }: PriceListFavoritesEmptyAlertProps) {
  return (
    <div className="mb-10">
      <Alert variant="success">
        <AlertTitle>У вас нет избранных категорий</AlertTitle>
        <AlertDescription>
          {isUserLoggedIn ? (
            <Fragment>
              Добавьте избранные категории в вашем профиле и они всегда будут закреплены вверху
              списка
            </Fragment>
          ) : (
            <Fragment>Войдите в свой аккаунт, чтобы добавлять категории в избранное.</Fragment>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}

export { PriceListFavoritesEmptyAlert };
