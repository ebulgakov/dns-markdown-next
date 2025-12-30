import { getPriceListsDiff } from "@/db/pricelist/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import PageTitle from "@/app/components/PageTitle";

export default async function UpdatesPage() {
  let diff;

  try {
    diff = await getPriceListsDiff();
  } catch (e) {
    const { message } = e as Error;
    return <ErrorMessage>{message}</ErrorMessage>;
  }

  return (
    <div>
      <PageTitle title="Обновления с начала дня" />
      <div className="text-lg">{JSON.stringify(diff, null, 2)}</div>
    </div>
  );
}
