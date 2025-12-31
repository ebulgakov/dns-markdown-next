import { getPriceListsDiff } from "@/db/pricelist/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import PageTitle from "@/app/components/PageTitle";
import PriceListSection from "@/app/components/PriceList/PriceListSection";
import { DiffsCollection as DiffsCollectionType } from "@/types/diff";

export default async function UpdatesPage() {
  let diffNew;
  let diffChangesPrice;
  const changePriceDiff: DiffsCollectionType = {};

  try {
    let collection = await getPriceListsDiff();
    collection = JSON.parse(JSON.stringify(collection));
    const collectionDiff = collection?.diff;

    if (collectionDiff && collectionDiff.new.length > 0) {
      diffNew = {
        _id: "new-items",
        title: "Новые поступления",
        items: collectionDiff.new?.map(item => item.item)
      };
    }

    if (collectionDiff && collectionDiff.changesPrice.length > 0) {
      diffChangesPrice = {
        _id: "change-price-items",
        title: "Изменения цены",
        items: collectionDiff.changesPrice?.map(item => {
          changePriceDiff[`${item.item._id}`] = item.diff;
          return item.item;
        })
      };
    }
  } catch (e) {
    const { message } = e as Error;
    return <ErrorMessage>{message}</ErrorMessage>;
  }

  return (
    <div>
      <PageTitle title="Обновления с начала дня" />
      {diffNew && <PriceListSection isOpen={true} position={diffNew} />}
      {diffChangesPrice && (
        <PriceListSection isOpen={true} position={diffChangesPrice} diffs={changePriceDiff} />
      )}
    </div>
  );
}
