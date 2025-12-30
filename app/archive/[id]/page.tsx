import { getPriceListById } from "@/db/pricelist/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import { formatDate } from "@/app/helpers/format";
import PriceList from "@/app/components/PriceList/PriceList";
import type { PriceList as PriceListType } from "@/types/pricelist";
import PageTitle from "@/app/components/PageTitle";

type ArchiveItemPage = {
  params: Promise<{ id: string }>;
};

export default async function ArchiveItemPage({ params }: ArchiveItemPage) {
  const { id } = await params;
  let priceList;

  try {
    priceList = await getPriceListById(id);
    if (!priceList) throw new Error(`No price list with id ${id}`);
    priceList = JSON.parse(JSON.stringify(priceList)) as PriceListType;
  } catch (e) {
    const { message } = e as Error;
    return <ErrorMessage>{message}</ErrorMessage>;
  }

  const pageTitle = `Страница Архива за ${formatDate(new Date(priceList.createdAt))}`;
  return (
    <div>
      <PageTitle title={pageTitle} />
      <PriceList positions={priceList.positions} />
    </div>
  );
}
