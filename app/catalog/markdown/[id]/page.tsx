import { ChartPrices } from "@/app/components/chart-prices";
import { PriceListGoods } from "@/app/components/price-list";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { Title } from "@/app/components/ui/title";
import { getProductById } from "@/db/pricelist/queries";

type CatalogItemPage = {
  params: Promise<{ id: string }>;
};

export default async function CatalogItemPage({ params }: CatalogItemPage) {
  const { id } = await params;
  let product;
  try {
    product = await getProductById(`/catalog/markdown/${id}/`);
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки товара</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <PageTitle title={product.item.title} />

      <PriceListGoods item={product.item} />

      <Title variant="h2">Сравнение цен</Title>

      <ul className="ml-5 list-disc">
        <li>
          <a
            className="font-bold"
            rel="noopener noreferrer"
            target="_blank"
            href={`https://market.yandex.ru/search?text=${encodeURI(product.item.title)}`}
          >
            <span className="text-[#ff0400]">Я.</span>Маркет
          </a>
        </li>
        <li>
          <a
            className="font-bold text-[#f37f00]"
            rel="noopener noreferrer"
            target="_blank"
            href={`https://www.citilink.ru/search/?text=${encodeURI(product.item.title)}`}
          >
            Ситилинк
          </a>
        </li>
      </ul>

      <Title variant="h2">График цены</Title>

      {product.history && <ChartPrices chartData={product.history} />}
    </div>
  );
}
