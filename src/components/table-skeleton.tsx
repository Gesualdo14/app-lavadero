"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "./ui/table";

export function TableSkeletonComponent({
  rows = 3,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <>
      {[...Array(rows)].map((_, rowIndex) => (
        <TableRow key={rowIndex} className="border-t">
          {[...Array(columns)].map((_, colIndex) => (
            <TableCell key={colIndex} className="px-4 py-2 w-48">
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
