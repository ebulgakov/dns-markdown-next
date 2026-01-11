import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate } from "@/app/helpers/format";
import { getArchiveList } from "@/db/pricelist/queries";
import { getUser } from "@/db/user/queries";

export default async function ArchivePage() {
  let archiveCollection;

  try {
    const user = await getUser();
    archiveCollection = await getArchiveList(user.city);
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки архива прайслистов</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <PageTitle title="Архив прайслистов" />
      <ul className="space-y-1">
        {archiveCollection.map(item => (
          <li key={item._id}>
            <Link href={`/archive/${item._id}`}>
              <span className="text-blue-500 hover:underline">{formatDate(item.createdAt)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
