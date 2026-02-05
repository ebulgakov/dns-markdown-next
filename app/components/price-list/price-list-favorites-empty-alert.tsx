import { Fragment } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

function PriceListFavoritesEmptyAlert() {
  return (
    <div className="mb-10">
      <Alert variant="success">
        <AlertTitle>У вас нет избранных категорий</AlertTitle>
        <AlertDescription>
          <Fragment>
            Добавьте избранные категории в вашем профиле или нажав на сердечко напротив заголовка и
            они всегда будут закреплены вверху списка
          </Fragment>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export { PriceListFavoritesEmptyAlert };
