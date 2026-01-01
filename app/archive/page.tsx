import { getArchiveList } from "@/db/pricelist/queries";
import Link from "next/link";
import ErrorMessage from "@/app/components/ErrorMessage";
import { formatDate } from "@/app/helpers/format";
import PageTitle from "@/app/components/PageTitle";

export default async function ArchivePage() {
  let archiveCollection;

  try {
    archiveCollection = await getArchiveList();
    if (!archiveCollection) throw new Error("No pricelist collection");
  } catch (e) {
    const { message } = e as Error;
    return <ErrorMessage>{message}</ErrorMessage>;
  }

  return (
    <div>
      <PageTitle title="Архив прайслистов" />
      <ul className="space-y-1">
        {archiveCollection.map(item => (
          <li key={item._id}>
            <Link href={`/archive/${item._id}`}>
              <span className="text-blue-500 hover:underline">
                {formatDate(new Date(item.createdAt))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
