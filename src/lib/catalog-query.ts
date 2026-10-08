import type { Course } from "@/types";

export const PAGE_SIZE = 9;

export type CourseSort = "code" | "title" | "credits";

export interface CourseQuery {
  q: string;
  dept: string;
  sort: CourseSort;
  page: number;
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

// Reads the URL's search params into a clean, safe query
export function parseCourseQuery(params: RawParams): CourseQuery {
  const sort = first(params.sort);
  return {
    q: first(params.q)?.trim() ?? "",
    dept: first(params.dept) ?? "all",
    sort: sort === "title" || sort === "credits" ? sort : "code",
    page: Math.max(1, Number(first(params.page)) || 1),
  };
}

export function queryCourses(courses: Course[], query: CourseQuery) {
  const needle = query.q.toLowerCase();

  const matches = courses
    .filter((course) => query.dept === "all" || course.department.id === query.dept)
    .filter(
      (course) =>
        !needle ||
        course.title.toLowerCase().includes(needle) ||
        course.code.toLowerCase().includes(needle)
    )
    .sort((a, b) => {
      if (query.sort === "title") return a.title.localeCompare(b.title);
      if (query.sort === "credits") return a.creditHours - b.creditHours || a.code.localeCompare(b.code);
      return a.code.localeCompare(b.code);
    });

  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(query.page, pageCount);

  return {
    items: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: matches.length,
    page,
    pageCount,
  };
}
