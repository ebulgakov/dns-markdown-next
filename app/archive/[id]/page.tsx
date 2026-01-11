import { PriceListPage } from "@/app/components/price-list";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate } from "@/app/helpers/format";
import { getPriceListById } from "@/db/pricelist/queries";

type ArchiveItemPage = {
  params: Promise<{ id: string }>;
};

export default async function ArchiveItemPage({ params }: ArchiveItemPage) {
  const { id } = await params;
  let priceList;

  try {
    priceList = await getPriceListById(id);
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки архива</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  const pageTitle = `Страница Архива за ${formatDate(priceList.createdAt)}`;
  return (
    <div>
      <PageTitle title={pageTitle} />
      <PriceListPage priceList={priceList} />
    </div>
  );
}
