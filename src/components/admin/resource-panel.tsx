"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Pencil, Plus, Trash2, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Pager } from "@/components/shared/pager";
import { SelectField } from "@/components/shared/select-field";
import { useUrlParams } from "@/hooks/use-url-params";
import { errorText, getPage, send } from "@/lib/fetchers";

export interface FieldDef {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  createOnly?: boolean; // the API does not let this change after creation
}

type Values = Record<string, string>;
const LIMIT = 10;

interface ResourcePanelProps<T extends { id: string }> {
  noun: string;
  endpoint: string;
  icon: LucideIcon;
  columns: Column<T>[];
  fields: FieldDef[];
  schema: z.ZodType<Values>;
  toPayload: (values: Values, editing: boolean) => Record<string, unknown>;
  toValues: (row: T) => Values;
}

export function ResourcePanel<T extends { id: string }>(props: ResourcePanelProps<T>) {
  const { noun, endpoint, icon, columns, fields, schema, toPayload, toValues } = props;
  const url = useUrlParams();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const label = noun.charAt(0).toUpperCase() + noun.slice(1);

  const list = useQuery({
    queryKey: ["admin", "resource", endpoint, url.page],
    queryFn: () => getPage<T>(endpoint, { page: url.page, limit: LIMIT }),
    placeholderData: (previous) => previous,
  });

  const refresh = () => queryClient.invalidateQueries();

  const save = useMutation({
    mutationFn: (v: { id?: string; payload: Record<string, unknown> }) =>
      v.id ? send("patch", `${endpoint}/${v.id}`, v.payload) : send("post", endpoint, v.payload),
    onSuccess: () => {
      toast.success(`${label} saved`);
      setEditing(null);
      refresh();
    },
    onError: (e) => toast.error(errorText(e)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => send("delete", `${endpoint}/${id}`),
    onSuccess: () => {
      toast.success(`${label} removed`);
      refresh();
    },
    onError: (e) => toast.error(errorText(e)),
  });

  const withActions: Column<T>[] = [
    ...columns,
    {
      header: "",
      cell: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" aria-label={`Edit ${noun}`} onClick={() => setEditing(row)}>
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Delete ${noun}`}
            disabled={remove.isPending}
            onClick={() => window.confirm(`Delete this ${noun}?`) && remove.mutate(row.id)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const isNew = editing === "new";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4" aria-hidden /> Add {noun}
        </Button>
      </div>

      {list.isLoading ? (
        <Skeleton className="h-64" />
      ) : list.isError ? (
        <p className="text-destructive">{errorText(list.error)}</p>
      ) : (
        <>
          <DataTable
            rows={list.data?.rows ?? []}
            rowKey={(r) => r.id}
            columns={withActions}
            emptyIcon={icon}
            emptyTitle={`No ${noun}s yet`}
            emptyText={`Add the first ${noun} to get started.`}
          />
          <Pager total={list.data?.meta?.total ?? 0} limit={LIMIT} />
        </>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          {editing !== null && (
            <ResourceForm
              key={isNew ? "new" : editing.id}
              title={`${isNew ? "Add" : "Edit"} ${noun}`}
              fields={fields.filter((f) => isNew || !f.createOnly)}
              schema={schema}
              initial={isNew ? {} : toValues(editing)}
              pending={save.isPending}
              onCancel={() => setEditing(null)}
              onSubmit={(values) =>
                save.mutate({ id: isNew ? undefined : editing.id, payload: toPayload(values, !isNew) })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ResourceFormProps {
  title: string;
  fields: FieldDef[];
  schema: z.ZodType<Values>;
  initial: Values;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (values: Values) => void;
}

function ResourceForm({ title, fields, schema, initial, pending, onCancel, onSubmit }: ResourceFormProps) {
  const form = useForm<Values>({
    defaultValues: Object.fromEntries(fields.map((f) => [f.name, initial[f.name] ?? ""])),
  });
  const errors = form.formState.errors;

  // Zod checks the values before anything is sent; each message lands under its field
  const submit = form.handleSubmit((values) => {
    // Only the fields on screen are checked, since create-only ones are hidden while editing
    const visible = Object.fromEntries(fields.map((f) => [f.name, values[f.name] ?? ""]));
    const parsed = schema.safeParse({ ...Object.fromEntries(Object.keys(schemaKeys(schema)).map((k) => [k, "x"])), ...visible });
    if (!parsed.success) {
      let blocked = false;
      for (const issue of parsed.error.issues) {
        const name = String(issue.path[0]);
        if (fields.some((f) => f.name === name)) {
          form.setError(name, { message: issue.message });
          blocked = true;
        }
      }
      if (blocked) return;
    }
    onSubmit(visible);
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      {fields.map((f) => (
        <div key={f.name} className="space-y-1.5">
          <Label htmlFor={`f-${f.name}`}>{f.label}</Label>
          {f.type === "select" ? (
            <Controller
              control={form.control}
              name={f.name}
              render={({ field }) => (
                <SelectField
                  id={`f-${f.name}`}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={f.placeholder ?? "Choose…"}
                  options={f.options ?? []}
                />
              )}
            />
          ) : (
            <Input
              id={`f-${f.name}`}
              type={f.type}
              placeholder={f.placeholder}
              min={f.type === "number" ? 0 : undefined}
              {...form.register(f.name)}
            />
          )}
          {errors[f.name] && <p className="text-sm text-destructive">{errors[f.name]?.message}</p>}
        </div>
      ))}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}

// Names of the fields a schema checks, used so hidden create-only fields don't block an edit
function schemaKeys(schema: z.ZodType<Values>): Record<string, true> {
  const shape = (schema as unknown as { shape?: Record<string, unknown> }).shape ?? {};
  return Object.fromEntries(Object.keys(shape).map((key) => [key, true as const]));
}