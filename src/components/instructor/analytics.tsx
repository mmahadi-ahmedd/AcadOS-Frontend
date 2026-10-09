"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, BookOpen, Users } from "lucide-react";
import { BarsChart } from "@/components/charts/charts";
import { DashHeading } from "@/components/shared/dash-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { errorText, getData } from "@/lib/fetchers";
import type { SectionRow } from "@/types/academic";

export function InstructorAnalytics() {
  const sections = useQuery({
    queryKey: ["instructor", "sections"],
    queryFn: () => getData<SectionRow[]>("/sections/my-sections"),
  });

  if (sections.isLoading) return <Skeleton className="h-96" />;
  if (sections.isError) return <p className="text-destructive">{errorText(sections.error)}</p>;

  const rows = sections.data ?? [];
  const chart = rows.map((s) => ({
    name: `${s.course?.code ?? "Course"}${s.sectionName ? ` ${s.sectionName}` : ""}`,
    value: s._count?.enrollments ?? 0,
  }));
  const students = chart.reduce((sum, c) => sum + c.value, 0);
  const credits = rows.reduce((sum, s) => sum + (s.course?.creditHours ?? 0), 0);
  const busiest = [...chart].sort((a, b) => b.value - a.value)[0];

  return (
    <>
      <DashHeading title="Teaching analytics" text="How your classes are filling up this term." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total students" value={students} icon={Users} />
        <StatCard label="Credit hours taught" value={credits} icon={BookOpen} />
        <StatCard label="Busiest section" value={busiest?.name ?? "—"} icon={BarChart3} note={busiest ? `${busiest.value} students` : undefined} />
      </div>

      {chart.length === 0 ? (
        <EmptyState icon={BarChart3} title="Nothing to chart yet" description="Numbers appear once you have sections with enrolled students." />
      ) : (
        <section className="rounded-md border bg-card p-5">
          <h2 className="mb-3 text-lg font-semibold text-primary">Students per section</h2>
          <BarsChart data={chart} />
        </section>
      )}
    </>
  );
}