import { getArchiveList } from "@/db/queries";
import Link from "next/link";

export default async function ArchivePage() {
  const archiveList = await getArchiveList();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Архив прайслистов</h1>
      <ul className="space-y-1">
        {archiveList.map(item => (
          <li key={item._id}>
            <Link href={`/archive/${item._id}`}>
              <span className="text-blue-500 hover:underline">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
