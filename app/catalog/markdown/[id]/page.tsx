import { getProductById } from "@/db/queries";
import ErrorMessage from "@/app/components/ErrorMessage";

type CatalogItemPage = {
  params: Promise<{ id: string }>
}

export default async function CatalogItemPage({ params }: CatalogItemPage) {
  const { id } = await params;
  let product;
  let error: Error | null = null;

  try {
    product = await getProductById(`/catalog/markdown/${id}/`);
  } catch (e) {
    error = e as Error;
  }


  if (!product && error) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  return (
    <div>
      <h1>Страница товара {id}</h1>
      <p>Здесь будет информация о товаре.</p>
      <div className="text-lg">{JSON.stringify(product, null, 2)}</div>
    </div>
  );
}
