import { CatalogSkeleton, ProgrammeListSkeleton } from "@/components/catalog/catalog-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="border-b bg-secondary/60">
        <div className="mx-auto max-w-6xl space-y-4 px-5 py-14 sm:py-20">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-16 px-5 py-14">
        <ProgrammeListSkeleton />
        <CatalogSkeleton />
      </div>
    </>
  );
}
