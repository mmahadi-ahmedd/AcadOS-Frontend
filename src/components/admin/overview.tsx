"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { BookOpen, GraduationCap, Layers, UserCheck, Users, Wallet } from "lucide-react";
import { BarsChart, DonutChart } from "@/components/charts/charts";
import { DashHeading } from "@/components/shared/dash-heading";
import { DashboardLoading } from "@/components/shared/dashboard-loading";
import { StatCard } from "@/components/shared/stat-card";
import { errorText, getData, getPage } from "@/lib/fetchers";
import { money } from "@/lib/format";

interface Stats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalSections: number;
  activeEnrollments: number;
  totalRevenue: number | string;
}

const roleGroups = [
  { role: "STUDENT", label: "Students" },
  { role: "INSTRUCTOR", label: "Faculty" },
  { role: "ADMIN", label: "Registrar's Office" },
];

export function AdminOverview() {
  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: () => getData<Stats>("/admin/dashboard-stats") });

  // One tiny request per role, only the total from the meta block is used
  const roles = useQueries({
    queries: roleGroups.map(({ role, label }) => ({
      queryKey: ["admin", "role-count", role],
      queryFn: async () => ({ name: label, value: (await getPage("/admin/users", { role, limit: 1 })).meta?.total ?? 0 }),
    })),
  });

  if (stats.isLoading) return <DashboardLoading />;
  if (stats.isError || !stats.data) {
    return <p className="py-10 text-center text-destructive">{errorText(stats.error)}</p>;
  }

  const s = stats.data;
  const bars = [
    { name: "Students", value: s.totalStudents },
    { name: "Faculty", value: s.totalInstructors },
    { name: "Courses", value: s.totalCourses },
    { name: "Sections", value: s.totalSections },
    { name: "Enrolments", value: s.activeEnrollments },
  ];
  const donut = roles.map((r) => r.data).filter((d): d is { name: string; value: number } => !!d);

  return (
    <>
      <DashHeading title="Registrar's overview" text="A snapshot of the university right now." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Students" value={s.totalStudents} icon={GraduationCap} />
        <StatCard label="Faculty" value={s.totalInstructors} icon={Users} />
        <StatCard label="Courses" value={s.totalCourses} icon={BookOpen} />
        <StatCard label="Sections this term" value={s.totalSections} icon={Layers} />
        <StatCard label="Active enrolments" value={s.activeEnrollments} icon={UserCheck} />
        <StatCard label="Fees collected" value={money(s.totalRevenue)} icon={Wallet} note="Paid through SSLCommerz" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-md border bg-card p-5 lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-primary">University in numbers</h2>
          <BarsChart data={bars} />
        </section>
        <section className="rounded-md border bg-card p-5">
          <h2 className="mb-3 text-lg font-semibold text-primary">Accounts by role</h2>
          <DonutChart data={donut} />
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {donut.map((d) => (
              <li key={d.name} className="flex justify-between">
                <span>{d.name}</span>
                <span className="font-medium text-primary">{d.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}