import { getPriceListById } from "@/db/queries";
import ErrorMessage from "@/app/components/ErrorMessage";

type ArchiveItemPage = {
  params: Promise<{ id: string }>;
};

export default async function ArchiveItemPage({ params }: ArchiveItemPage) {
  const { id } = await params;
  let priceList;
  let error: Error | null = null;
  try {
    priceList = await getPriceListById(id);
  } catch (e) {
    error = e as Error;
  }

  if (!priceList && error) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Страница Архива за&nbsp;
        {new Date(priceList.createdAt).toLocaleDateString()}{" "}
      </h1>
      <div className="text-lg">{JSON.stringify(priceList, null, 2)}</div>
    </div>
  );
}
