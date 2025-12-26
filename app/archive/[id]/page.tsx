export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <h1>Страница архива {id}</h1>
    </div>
  );
}
