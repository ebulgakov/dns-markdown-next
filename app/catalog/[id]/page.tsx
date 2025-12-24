export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <h1>Страница товара {id}</h1>
      <p>Здесь будет информация о товаре.</p>
      <p>Вы можете добавить сюда детали, такие как цена, описание и изображения.</p>
    </div>
  );
}
