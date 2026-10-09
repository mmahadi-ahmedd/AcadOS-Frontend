"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Keeps filters and page numbers in the address bar so views can be shared
export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  function set(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(search.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!("page" in patch)) next.delete("page");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return {
    get: (key: string) => search.get(key) ?? "",
    page: Math.max(1, Number(search.get("page")) || 1),
    set,
  };
}