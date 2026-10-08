import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  basePath: string;
  params: Record<string, string>;
  page: number;
  pageCount: number;
  anchor?: string;
}

export function Pagination({ basePath, params, page, pageCount, anchor }: PaginationProps) {
  if (pageCount <= 1) return null;

  function hrefFor(target: number) {
    const search = new URLSearchParams(params);
    if (target > 1) search.set("page", String(target));
    const query = search.toString();
    return `${basePath}${query ? `?${query}` : ""}${anchor ? `#${anchor}` : ""}`;
  }

  // Show a window of up to five page numbers around the current one
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const end = Math.min(pageCount, start + 4);
  const numbers = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </Link>
      )}

      {numbers.map((number) => (
        <Link
          key={number}
          href={hrefFor(number)}
          aria-current={number === page ? "page" : undefined}
          className={cn(
            buttonVariants({ variant: number === page ? "default" : "ghost", size: "sm" }),
            "min-w-9"
          )}
        >
          {number}
        </Link>
      ))}

      {page < pageCount && (
        <Link href={hrefFor(page + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
          Next
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
