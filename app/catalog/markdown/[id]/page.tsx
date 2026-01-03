import { getProductById } from "@/db/pricelist/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import PageTitle from "@/app/components/PageTitle";
import PriceListGoods from "@/app/components/PriceList/PriceListGoods";
import ProductPricesChart from "@/app/components/ProductPricesChart";
import Title from "@/app/components/Title";

type CatalogItemPage = {
  params: Promise<{ id: string }>;
};

export default async function CatalogItemPage({ params }: CatalogItemPage) {
  const { id } = await params;
  let product;
  let error: Error | null = null;

  try {
    product = await getProductById(`/catalog/markdown/${id}/`);

    if (!product)
      throw new Error(
        `Нет товара с id: ${id}. Возможно он был удалён. \nПопробуйте вернуться на главную страницу каталога.`
      );

    product = JSON.parse(JSON.stringify(product));
  } catch (e) {
    error = e as Error;
  }

  if (!product) {
    return <ErrorMessage>{error?.message}</ErrorMessage>;
  }

  return (
    <div>
      <PageTitle title={product.item.title} />

      <PriceListGoods item={product.item} />

      <Title variant="h2">Сравнение цен</Title>

      <ul className="list-disc ml-5">
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
            className="text-[#f37f00] font-bold"
            rel="noopener noreferrer"
            target="_blank"
            href={`https://www.citilink.ru/search/?text=${encodeURI(product.item.title)}`}
          >
            Ситилинк
          </a>
        </li>
      </ul>

      <Title variant="h2">График цены</Title>

      {product.history && <ProductPricesChart chartData={product.history} />}
    </div>
  );
}
