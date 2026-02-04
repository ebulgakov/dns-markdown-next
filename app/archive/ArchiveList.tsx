"use client";

import Link from "next/link";

import { formatDate } from "@/app/helpers/format";
import { sendGAEvent } from "@/app/lib/sendGAEvent";

import type { PriceListDate } from "@/types/pricelist";

type ArchiveListProps = {
  archiveCollection: PriceListDate[];
};
export function ArchiveList({ archiveCollection }: ArchiveListProps) {
  const handleSendGAEvent = (date: string) => {
    sendGAEvent({
      event: "archive_pricelist_click",
      value: date,
      category: "ArchivePage",
      action: "click"
    });
  };

  return (
    <ul className="space-y-1">
      {archiveCollection.map(item => (
        <li key={item._id}>
          <Link
            href={`/archive/${item._id}`}
            data-testid="archive-list-item-link"
            onClick={() => handleSendGAEvent(formatDate(item.createdAt))}
          >
            <span className="text-blue-500 hover:underline">{formatDate(item.createdAt)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
