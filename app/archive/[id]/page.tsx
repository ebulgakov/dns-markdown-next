import { getPriceListById } from "@/db/pricelist/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import { formatDate } from "@/app/helpers/format";
import PriceList from "@/app/components/PriceList/PriceList";
import type { PriceList as PriceListType } from "@/types/pricelist";

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

  return (
    <div>
      <div className="flex justify-between items-end border-b border-solid border-b-neutral-300  mt-10 mb-5 mx-0 pb-5">
        <h1 className="text-4xl">
          Страница Архива за&nbsp;
          {formatDate(new Date(priceList.createdAt))}
        </h1>
      </div>

      <PriceList positions={priceList.positions} />
    </div>
  );
}
