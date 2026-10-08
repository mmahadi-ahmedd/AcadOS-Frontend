import type { Course } from "@/types";

export function CourseCard({ course }: { course: Course }) {
  const prerequisites = course.prerequisites.map((entry) => entry.prerequisite.code);

  return (
    <article className="flex flex-col rounded-md border border-l-4 border-l-gold bg-card p-5">
      <p className="font-mono text-xs font-medium tracking-wider text-gold">{course.code}</p>
      <h3 className="mt-1 text-xl font-semibold leading-snug text-primary">{course.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{course.department.name}</p>

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t pt-3 text-sm">
        <div className="flex gap-1.5">
          <dt className="text-muted-foreground">Credits</dt>
          <dd className="font-medium">{course.creditHours}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-muted-foreground">Prerequisite</dt>
          <dd className="font-medium">{prerequisites.length ? prerequisites.join(", ") : "None"}</dd>
        </div>
      </dl>
    </article>
  );
}
