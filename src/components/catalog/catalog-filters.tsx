"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { SelectField } from "@/components/shared/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import type { Department } from "@/types";

const SORT_OPTIONS = [
  { value: "code", label: "Course code" },
  { value: "title", label: "Title (A to Z)" },
  { value: "credits", label: "Credit hours" },
];

export function CatalogFilters({ departments }: { departments: Department[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [text, setText] = useState(searchParams.get("q") ?? "");
  const debouncedText = useDebounce(text, 350);

  // Every filter lives in the URL, so a filtered view can be bookmarked or shared
  const updateParams = useCallback(
    (changes: Record<string, string | null>) => {
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(changes)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      params.delete("page");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    const current = new URLSearchParams(window.location.search).get("q") ?? "";
    if (current !== debouncedText.trim()) updateParams({ q: debouncedText.trim() || null });
  }, [debouncedText, updateParams]);

  const department = searchParams.get("dept") ?? "all";
  const sort = searchParams.get("sort") ?? "code";
  const hasFilters = Boolean(searchParams.get("q") || searchParams.get("dept") || searchParams.get("sort"));

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_15rem_11rem_auto]">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Search by title or code"
          aria-label="Search courses"
          className="pl-9"
        />
      </div>

      <SelectField
        id="department-filter"
        value={department}
        onChange={(value) => updateParams({ dept: value === "all" ? null : value })}
        placeholder="Department"
        options={[
          { value: "all", label: "All departments" },
          ...departments.map((item) => ({ value: item.id, label: item.name })),
        ]}
      />

      <SelectField
        id="sort-filter"
        value={sort}
        onChange={(value) => updateParams({ sort: value === "code" ? null : value })}
        placeholder="Sort by"
        options={SORT_OPTIONS}
      />

      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setText("");
            router.replace(pathname, { scroll: false });
          }}
        >
          <X className="size-4" aria-hidden />
          Clear
        </Button>
      )}
    </div>
  );
}
