import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/catalog/course-card";
import { buttonVariants } from "@/components/ui/button";
import { getCatalog } from "@/lib/server/catalog";

export async function CatalogHighlights() {
  const { departments, programmes, courses } = await getCatalog();

  const figures = [
    { label: "Departments", value: departments.length },
    { label: "Degree programmes", value: programmes.length },
    { label: "Courses on offer", value: courses.length },
  ];

  return (
    <div className="space-y-10">
      <dl className="grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-3">
        {figures.map((figure) => (
          <div key={figure.label} className="bg-card px-6 py-5">
            <dt className="text-sm text-muted-foreground">{figure.label}</dt>
            <dd className="font-serif text-4xl font-semibold text-primary">{figure.value}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">Recently added courses</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      <Link href="/programmes#courses" className={buttonVariants({ variant: "outline" })}>
        Browse the full catalogue
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
