import { getPriceList } from "@/db/queries";

export default async function CatalogPage() {
  const priceList = await getPriceList();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Catalog Page</h1>
      <div className="text-lg">{JSON.stringify(priceList, null, 2)}</div>
    </div>
  );
}
