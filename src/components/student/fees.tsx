"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleDollarSign, Receipt, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashHeading } from "@/components/shared/dash-heading";
import { DataTable } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { errorText, getData, send } from "@/lib/fetchers";
import { money, shortDate } from "@/lib/format";
import type { FeeRow } from "@/types/academic";

export function StudentFees() {
  const fees = useQuery({ queryKey: ["student", "fees"], queryFn: () => getData<FeeRow[]>("/fees/my-fees") });

  // The backend hands back the SSLCommerz page; we simply send the browser there
  const pay = useMutation({
    mutationFn: (feeId: string) => send<{ gatewayUrl: string }>("post", "/payments/initiate", { feeId }),
    onSuccess: ({ gatewayUrl }) => {
      toast.info("Taking you to the payment page");
      window.location.href = gatewayUrl;
    },
    onError: (e) => toast.error(errorText(e)),
  });

  const rows = fees.data ?? [];
  const sum = (status: string) =>
    rows.filter((f) => f.status === status).reduce((total, f) => total + Number(f.amount), 0);

  return (
    <>
      <DashHeading title="Fees and payments" text="Pay your term fees securely through SSLCommerz." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding" value={money(sum("UNPAID") + sum("PENDING"))} icon={CircleDollarSign} />
        <StatCard label="Paid so far" value={money(sum("PAID"))} icon={Wallet} />
        <StatCard label="Invoices" value={rows.length} icon={Receipt} />
      </div>

      {fees.isLoading ? (
        <Skeleton className="h-56" />
      ) : fees.isError ? (
        <p className="text-destructive">{errorText(fees.error)}</p>
      ) : (
        <DataTable
          rows={rows}
          rowKey={(f) => f.id}
          emptyIcon={Receipt}
          emptyTitle="No fees raised"
          emptyText="When the registrar issues a fee for you it will appear here."
          columns={[
            { header: "Term", cell: (f) => f.semester?.name ?? "—" },
            { header: "Issued", cell: (f) => shortDate(f.createdAt) },
            { header: "Amount", cell: (f) => <span className="font-medium text-primary">{money(f.amount)}</span> },
            { header: "Status", cell: (f) => <StatusBadge status={f.status} /> },
            {
              header: "",
              cell: (f) =>
                f.status !== "PAID" && (
                  <Button size="sm" disabled={pay.isPending} onClick={() => pay.mutate(f.id)}>
                    Pay now
                  </Button>
                ),
            },
          ]}
        />
      )}
    </>
  );
}