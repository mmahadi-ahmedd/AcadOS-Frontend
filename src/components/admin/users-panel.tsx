"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashHeading } from "@/components/shared/dash-heading";
import { DataTable } from "@/components/shared/data-table";
import { Pager } from "@/components/shared/pager";
import { SearchBox } from "@/components/shared/search-box";
import { SelectField } from "@/components/shared/select-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useUrlParams } from "@/hooks/use-url-params";
import { errorText, getPage, send } from "@/lib/fetchers";
import { shortDate } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const LIMIT = 10;
const roleOptions = [
  { value: "STUDENT", label: "Student" },
  { value: "INSTRUCTOR", label: "Faculty" },
  { value: "ADMIN", label: "Registrar's Office" },
];

export function UsersPanel() {
  const url = useUrlParams();
  const queryClient = useQueryClient();
  const me = useAuthStore((s) => s.user);

  const q = url.get("q");
  const role = url.get("role");
  const params = { page: url.page, limit: LIMIT, search: q || undefined, role: role || undefined };

  const users = useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getPage<UserRow>("/admin/users", params),
    placeholderData: (previous) => previous,
  });

  const changeRole = useMutation({
    mutationFn: (v: { id: string; role: string }) => send("patch", `/admin/users/${v.id}/role`, { role: v.role }),
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e) => toast.error(errorText(e)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => send("delete", `/admin/users/${id}`),
    onSuccess: () => {
      toast.success("Account removed");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e) => toast.error(errorText(e)),
  });

  return (
    <>
      <DashHeading title="Manage accounts" text="Search people, change who can do what, or remove an account." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBox placeholder="Search by name or email" />
        <div className="w-full sm:w-56">
          <SelectField
            id="role-filter"
            value={role || "ALL"}
            onChange={(next) => url.set({ role: next === "ALL" ? undefined : next })}
            options={[{ value: "ALL", label: "All roles" }, ...roleOptions]}
            placeholder="Role"
          />
        </div>
      </div>

      {users.isLoading ? (
        <Skeleton className="h-72" />
      ) : users.isError ? (
        <p className="py-8 text-center text-destructive">{errorText(users.error)}</p>
      ) : (
        <>
          <DataTable
            rows={users.data?.rows ?? []}
            rowKey={(u) => u.id}
            emptyIcon={Users}
            emptyTitle="No accounts found"
            emptyText="Try a different name or clear the role filter."
            columns={[
              { header: "Name", cell: (u) => <span className="font-medium text-primary">{u.name}</span> },
              { header: "Email", cell: (u) => u.email },
              { header: "Joined", cell: (u) => shortDate(u.createdAt) },
              {
                header: "Role",
                cell: (u) => (
                  <div className="w-44">
                    <SelectField
                      id={`role-${u.id}`}
                      value={u.role}
                      disabled={u.id === me?.id || changeRole.isPending}
                      onChange={(next) => next !== u.role && changeRole.mutate({ id: u.id, role: next })}
                      options={roleOptions}
                      placeholder="Role"
                    />
                  </div>
                ),
              },
              {
                header: "",
                cell: (u) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove ${u.name}`}
                    disabled={u.id === me?.id || remove.isPending}
                    onClick={() => window.confirm(`Remove ${u.name}'s account?`) && remove.mutate(u.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                ),
              },
            ]}
          />
          <Pager total={users.data?.meta?.total ?? 0} limit={LIMIT} />
        </>
      )}
    </>
  );
}