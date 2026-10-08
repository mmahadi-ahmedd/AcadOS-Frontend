import { SearchX } from "lucide-react";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CourseCard } from "@/components/catalog/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { PAGE_SIZE, parseCourseQuery, queryCourses } from "@/lib/catalog-query";
import { getCatalog } from "@/lib/server/catalog";

interface CourseCatalogueProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function CourseCatalogue({ searchParams }: CourseCatalogueProps) {
  const query = parseCourseQuery(await searchParams);
  const { courses, departments } = await getCatalog();
  const { items, total, page, pageCount } = queryCourses(courses, query);

  // Filters that should survive when moving between pages
  const keep: Record<string, string> = {};
  if (query.q) keep.q = query.q;
  if (query.dept !== "all") keep.dept = query.dept;
  if (query.sort !== "code") keep.sort = query.sort;

  const firstShown = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <CatalogFilters departments={departments} />

      {items.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No courses match your search"
          description="Try a different keyword, or clear the filters to see the whole catalogue."
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing {firstShown}&ndash;{lastShown} of {total} courses
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <Pagination
            basePath="/programmes"
            params={keep}
            page={page}
            pageCount={pageCount}
            anchor="courses"
          />
        </>
      )}
    </div>
  );
}
