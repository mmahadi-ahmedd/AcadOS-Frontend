import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyText: string;
}

export function DataTable<T>({ rows, columns, rowKey, emptyIcon, emptyTitle, emptyText }: DataTableProps<T>) {
  if (rows.length === 0) return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyText} />;

  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-secondary/60 text-primary">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className={`px-4 py-3 font-medium ${col.className ?? ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-secondary/30">
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 ${col.className ?? ""}`}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}