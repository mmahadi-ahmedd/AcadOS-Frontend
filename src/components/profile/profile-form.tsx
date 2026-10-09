"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DashHeading } from "@/components/shared/dash-heading";
import { errorText, getData, send } from "@/lib/fetchers";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().regex(/^(\+?\d{7,15})?$/, "Use digits only, e.g. 01712345678"),
});
type Values = z.infer<typeof schema>;

interface Me {
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  student?: { studentId?: string; department?: { name: string }; program?: { name: string } } | null;
  instructor?: { employeeId?: string; designation?: string | null; department?: { name: string } } | null;
}

export function ProfileForm() {
  const queryClient = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: () => getData<Me>("/users/me") });

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    values: me.data ? { name: me.data.name, phone: me.data.phone ?? "" } : undefined,
  });

  const save = useMutation({
    mutationFn: (v: Values) => send("patch", "/users/me", { name: v.name, ...(v.phone && { phone: v.phone }) }),
    onSuccess: (_, v) => {
      toast.success("Profile saved");
      useAuthStore.setState((s) => ({ user: s.user ? { ...s.user, name: v.name } : null }));
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e) => toast.error(errorText(e)),
  });

  if (me.isLoading) return <Skeleton className="h-80" />;
  const data = me.data;
  if (!data) return <p className="text-destructive">{errorText(me.error)}</p>;

  const facts: [string, string | undefined][] = [
    ["Email", data.email],
    ["Student ID", data.student?.studentId],
    ["Programme", data.student?.program?.name],
    ["Employee ID", data.instructor?.employeeId],
    ["Designation", data.instructor?.designation ?? undefined],
    ["Department", data.student?.department?.name ?? data.instructor?.department?.name],
  ];

  return (
    <>
      <DashHeading title="Profile and settings" text="Keep your contact details up to date." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="space-y-4 rounded-md border bg-card p-5" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" inputMode="tel" {...form.register("phone")} aria-invalid={!!form.formState.errors.phone} />
            {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
          </div>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>

        <dl className="space-y-3 rounded-md border bg-card p-5 text-sm">
          {facts.filter(([, v]) => v).map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b pb-2 last:border-0">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}