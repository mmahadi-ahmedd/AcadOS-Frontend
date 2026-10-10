"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Plus, Receipt } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DashHeading } from "@/components/shared/dash-heading";
import { DataTable } from "@/components/shared/data-table";
import { Pager } from "@/components/shared/pager";
import { SelectField } from "@/components/shared/select-field";
import { StatusBadge } from "@/components/shared/status-badge";
import { useUrlParams } from "@/hooks/use-url-params";
import { errorText, getPage, send } from "@/lib/fetchers";
import { money, shortDate } from "@/lib/format";

interface AdminFee {
  id: string;
  amount: number | string;
  status: string;
  createdAt: string;
  student?: { studentId?: string; user?: { name: string; email: string } };
  semester?: { name?: string; year?: number };
}
interface StudentUser {
  id: string;
  name: string;
  student?: { id: string; studentId: string } | null;
}
interface SemesterRow {
  id: string;
  name: string;
  year: number;
}

const LIMIT = 10;
const ALL = "ALL";

export function FeesPanel() {
  const url = useUrlParams();
  const [creating, setCreating] = useState(false);
  const status = url.get("status");
  const params = { page: url.page, limit: LIMIT, status: status || undefined };

  const fees = useQuery({
    queryKey: ["admin", "fees", params],
    queryFn: () => getPage<AdminFee>("/fees", params),
    placeholderData: (previous) => previous,
  });

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <DashHeading title="Student fees" text="Raise a fee for a term and follow what has been paid." />
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden /> Generate fee
        </Button>
      </div>

      <div className="w-full sm:w-56">
        <SelectField
          id="fee-status"
          value={status || ALL}
          onChange={(next) => url.set({ status: next === ALL ? undefined : next })}
          placeholder="Status"
          options={[
            { value: ALL, label: "All statuses" },
            { value: "PENDING", label: "Pending" },
            { value: "PAID", label: "Paid" },
            { value: "FAILED", label: "Failed" },
          ]}
        />
      </div>

      {fees.isLoading ? (
        <Skeleton className="h-64" />
      ) : fees.isError ? (
        <p className="text-destructive">{errorText(fees.error)}</p>
      ) : (
        <>
          <DataTable
            rows={fees.data?.rows ?? []}
            rowKey={(f) => f.id}
            emptyIcon={Receipt}
            emptyTitle="No fees here yet"
            emptyText="Use Generate fee to bill a student for a term."
            columns={[
              {
                header: "Student",
                cell: (f) => (
                  <>
                    <span className="font-medium text-primary">{f.student?.user?.name}</span>
                    <span className="block text-xs text-muted-foreground">{f.student?.studentId}</span>
                  </>
                ),
              },
              { header: "Term", cell: (f) => (f.semester ? `${f.semester.name} ${f.semester.year ?? ""}` : "—") },
              { header: "Issued", cell: (f) => shortDate(f.createdAt) },
              { header: "Amount", cell: (f) => money(f.amount) },
              { header: "Status", cell: (f) => <StatusBadge status={f.status} /> },
            ]}
          />
          <Pager total={fees.data?.meta?.total ?? 0} limit={LIMIT} />
        </>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="sm:max-w-md">
          {creating && <FeeForm onDone={() => setCreating(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

const schema = z.object({
  studentId: z.string().min(1, "Choose a student"),
  semesterId: z.string().min(1, "Choose a term"),
  amount: z.string().refine((v) => Number(v) > 0, "Enter an amount above zero"),
});
type Values = z.infer<typeof schema>;

function FeeForm({ onDone }: { onDone: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { studentId: "", semesterId: "", amount: "" } });
  const errors = form.formState.errors;

  const students = useQuery({
    queryKey: ["admin", "student-list"],
    queryFn: () => getPage<StudentUser>("/admin/users", { role: "STUDENT", limit: 100 }),
  });
  const terms = useQuery({
    queryKey: ["admin", "semester-list"],
    queryFn: () => getPage<SemesterRow>("/semesters", { limit: 100 }),
  });

  const billable = (students.data?.rows ?? []).filter((u) => u.student?.id);

  const create = useMutation({
    mutationFn: async (v: Values) => {
      const targets = v.studentId === ALL ? billable.map((u) => u.student!.id) : [v.studentId];
      const results = await Promise.allSettled(
        targets.map((studentId) => send("post", "/fees", { studentId, semesterId: v.semesterId, amount: Number(v.amount) }))
      );
      const made = results.filter((r) => r.status === "fulfilled").length;
      // A 409 just means that student already has a fee for the term
      if (made === 0) {
        const first = results.find((r) => r.status === "rejected");
        throw first && first.status === "rejected" ? first.reason : new Error("No fee was created");
      }
      return { made, skipped: results.length - made };
    },
    onSuccess: ({ made, skipped }) => {
      toast.success(`${made} fee${made === 1 ? "" : "s"} raised${skipped ? `, ${skipped} already had one` : ""}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "fees"] });
      onDone();
    },
    onError: (e) => toast.error(errorText(e)),
  });

  return (
    <form onSubmit={form.handleSubmit((v) => create.mutate(v))} className="space-y-4" noValidate>
      <DialogHeader>
        <DialogTitle>Generate fee</DialogTitle>
        <DialogDescription>The student will see it under Fees and payments and can pay online.</DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <Label htmlFor="fee-student">Student</Label>
        <Controller
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <SelectField
              id="fee-student"
              value={field.value}
              onChange={field.onChange}
              placeholder={students.isLoading ? "Loading students…" : "Choose a student"}
              options={[
                ...(billable.length > 1 ? [{ value: ALL, label: `All students (${billable.length})` }] : []),
                ...billable.map((u) => ({ value: u.student!.id, label: `${u.name} (${u.student!.studentId})` })),
              ]}
            />
          )}
        />
        {!students.isLoading && billable.length === 0 && (
          <p className="text-sm text-muted-foreground">No student has completed their academic profile yet.</p>
        )}
        {errors.studentId && <p className="text-sm text-destructive">{errors.studentId.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fee-term">Term</Label>
        <Controller
          control={form.control}
          name="semesterId"
          render={({ field }) => (
            <SelectField
              id="fee-term"
              value={field.value}
              onChange={field.onChange}
              placeholder={terms.isLoading ? "Loading terms…" : "Choose a term"}
              options={(terms.data?.rows ?? []).map((t) => ({ value: t.id, label: `${t.name} ${t.year}` }))}
            />
          )}
        />
        {errors.semesterId && <p className="text-sm text-destructive">{errors.semesterId.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fee-amount">Amount (৳)</Label>
        <Input id="fee-amount" type="number" min="1" step="any" {...form.register("amount")} />
        {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? "Creating…" : "Create fee"}
        </Button>
      </div>
    </form>
  );
}