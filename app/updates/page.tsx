import { getPriceListsDiff } from "@/db/pricelist/queries";
import ErrorMessage from "@/app/components/ErrorMessage";

export default async function UpdatesPage() {
  let diff;
  let error: Error | null = null;

  try {
    diff = await getPriceListsDiff();
  } catch (e) {
    error = e as Error;
  }

  if (!diff && error) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Обновления с начала дня</h1>
      <div className="text-lg">{JSON.stringify(diff, null, 2)}</div>
    </div>
  );
}
