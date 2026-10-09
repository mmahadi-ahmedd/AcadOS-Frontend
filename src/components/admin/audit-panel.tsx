"use client";

import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";
import { DashHeading } from "@/components/shared/dash-heading";
import { DataTable } from "@/components/shared/data-table";
import { Pager } from "@/components/shared/pager";
import { SearchBox } from "@/components/shared/search-box";
import { Skeleton } from "@/components/ui/skeleton";
import { useUrlParams } from "@/hooks/use-url-params";
import { errorText, getPage } from "@/lib/fetchers";
import { shortDate } from "@/lib/format";

interface LogRow {
  id: string;
  action: string;
  entityType: string;
  createdAt: string;
  user: { name: string; email: string; role: string };
}

const LIMIT = 10;

export function AuditPanel() {
  const url = useUrlParams();
  const q = url.get("q").toLowerCase();

  const logs = useQuery({
    queryKey: ["admin", "audit", url.page],
    queryFn: () => getPage<LogRow>("/admin/audit-logs", { page: url.page, limit: LIMIT }),
    placeholderData: (previous) => previous,
  });

  // The search box narrows the page that is already loaded
  const rows = (logs.data?.rows ?? []).filter(
    (r) => !q || `${r.action} ${r.entityType} ${r.user?.name}`.toLowerCase().includes(q)
  );

  return (
    <>
      <DashHeading title="Reports and audit trail" text="Every sensitive change made in the system, newest first." />
      <SearchBox placeholder="Filter by action, record or person" />

      {logs.isLoading ? (
        <Skeleton className="h-72" />
      ) : logs.isError ? (
        <p className="py-8 text-center text-destructive">{errorText(logs.error)}</p>
      ) : (
        <>
          <DataTable
            rows={rows}
            rowKey={(r) => r.id}
            emptyIcon={ScrollText}
            emptyTitle="Nothing logged yet"
            emptyText="Actions such as role changes and results will show up here."
            columns={[
              { header: "When", cell: (r) => shortDate(r.createdAt) },
              {
                header: "Done by",
                cell: (r) => (
                  <>
                    <span className="font-medium text-primary">{r.user?.name}</span>
                    <span className="block text-xs text-muted-foreground">{r.user?.email}</span>
                  </>
                ),
              },
              { header: "Action", cell: (r) => r.action.replaceAll("_", " ").toLowerCase() },
              { header: "Record", cell: (r) => r.entityType },
            ]}
          />
          <Pager total={logs.data?.meta?.total ?? 0} limit={LIMIT} />
        </>
      )}
    </>
  );
}