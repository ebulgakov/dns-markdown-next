import { getPriceListById } from "@/db/pricelist/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import { formatDate } from "@/app/helpers/format";

type ArchiveItemPage = {
  params: Promise<{ id: string }>;
};

export default async function ArchiveItemPage({ params }: ArchiveItemPage) {
  const { id } = await params;
  let priceList;

  try {
    priceList = await getPriceListById(id);

    if (!priceList) throw new Error(`No price list with id ${id}`);
  } catch (e) {
    const { message } = e as Error;
    return <ErrorMessage>{message}</ErrorMessage>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Страница Архива за&nbsp;
        {formatDate(new Date(priceList.createdAt))}
      </h1>
      <div className="text-lg">{JSON.stringify(priceList, null, 2)}</div>
    </div>
  );
}
