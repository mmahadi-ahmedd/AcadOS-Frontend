"use client";

import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/use-url-params";

export function Pager({ total, limit }: { total: number; limit: number }) {
  const url = useUrlParams();
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <Button variant="outline" size="sm" disabled={url.page <= 1} onClick={() => url.set({ page: String(url.page - 1) })}>
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {url.page} of {pages}
      </span>
      <Button variant="outline" size="sm" disabled={url.page >= pages} onClick={() => url.set({ page: String(url.page + 1) })}>
        Next
      </Button>
    </div>
  );
}