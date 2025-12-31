import { getProductById } from "@/db/pricelist/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import PageTitle from "@/app/components/PageTitle";

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
  } catch (e) {
    error = e as Error;
  }

  if (!product) {
    return <ErrorMessage>{error?.message}</ErrorMessage>;
  }

  return (
    <div>
      <PageTitle title="Страница товара" />

      <h2> {id}</h2>
      <p>Здесь будет информация о товаре.</p>
      <div className="text-lg">{JSON.stringify(product, null, 2)}</div>
    </div>
  );
}
