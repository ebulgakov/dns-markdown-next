import { getPriceListById } from "@/db/queries";

type ArchiveItemPage = {
  params: Promise<{ id: string }>
}

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
    return <div className="border border-red-500 bg-red-300 p-10 rounded-sm">{error.message}</div>;
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
