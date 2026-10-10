"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, CalendarCheck, ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashHeading } from "@/components/shared/dash-heading";
import { DataTable } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { errorText, getData } from "@/lib/fetchers";
import { shortDate } from "@/lib/format";

interface CourseRef {
  code: string;
  title: string;
  creditHours?: number;
}
interface ResultRow {
  id: string;
  marksObtained: number;
  gradePoint: number | null;
  exam: { title: string; totalMarks: number; section?: { course?: CourseRef } };
}
interface AttendanceRow {
  id: string;
  date: string;
  status: string;
  section: { course: CourseRef };
}
interface Transcript {
  cgpa: number | null;
  completedCourses: { id: string; section: { course: CourseRef } }[];
}

export function StudentProgress() {
  const results = useQuery({ queryKey: ["student", "results"], queryFn: () => getData<ResultRow[]>("/results/my-results") });
  const attendance = useQuery({ queryKey: ["student", "attendance"], queryFn: () => getData<AttendanceRow[]>("/attendance/my-attendance") });
  const transcript = useQuery({ queryKey: ["student", "transcript"], queryFn: () => getData<Transcript>("/results/transcript") });

  if (results.isLoading || attendance.isLoading || transcript.isLoading) return <Skeleton className="h-96" />;
  if (results.isError && attendance.isError) return <p className="text-destructive">{errorText(results.error)}</p>;

  const att = attendance.data ?? [];
  const byCourse = att.reduce<Record<string, { course: string; present: number; late: number; absent: number }>>((acc, a) => {
    const key = a.section.course.code;
    const row = (acc[key] ??= { course: `${key} ${a.section.course.title}`, present: 0, late: 0, absent: 0 });
    if (a.status === "PRESENT") row.present++;
    else if (a.status === "LATE") row.late++;
    else row.absent++;
    return acc;
  }, {});
  const summary = Object.values(byCourse);
  const total = att.length;
  const attended = att.filter((a) => a.status !== "ABSENT").length;

  return (
    <>
      <DashHeading title="My progress" text="Attendance, exam results and your transcript in one place." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="CGPA" value={transcript.data?.cgpa != null ? Number(transcript.data.cgpa).toFixed(2) : "—"} icon={Award} note="Updated when grades are finalised" />
        <StatCard label="Attendance" value={total ? `${Math.round((attended / total) * 100)}%` : "—"} icon={CalendarCheck} note={`${total} classes recorded`} />
        <StatCard label="Courses completed" value={transcript.data?.completedCourses.length ?? 0} icon={ClipboardList} />
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-primary">Attendance by course</h2>
        <DataTable
          rows={summary}
          rowKey={(r) => r.course}
          emptyIcon={CalendarCheck}
          emptyTitle="No attendance yet"
          emptyText="Your faculty's attendance records will show here."
          columns={[
            { header: "Course", cell: (r) => <span className="font-medium text-primary">{r.course}</span> },
            { header: "Present", cell: (r) => r.present },
            { header: "Late", cell: (r) => r.late },
            { header: "Absent", cell: (r) => r.absent },
            { header: "Attended", cell: (r) => `${Math.round(((r.present + r.late) / (r.present + r.late + r.absent)) * 100)}%` },
          ]}
        />
        {att[0] && <p className="text-xs text-muted-foreground">Latest class on record: {shortDate(att[0].date)} ({att[0].section.course.code})</p>}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-primary">Exam results</h2>
        <DataTable
          rows={results.data ?? []}
          rowKey={(r) => r.id}
          emptyIcon={ClipboardList}
          emptyTitle="No results yet"
          emptyText="Marks appear here after your faculty enters them."
          columns={[
            { header: "Course", cell: (r) => r.exam.section?.course?.code ?? "—" },
            { header: "Exam", cell: (r) => r.exam.title },
            { header: "Marks", cell: (r) => `${r.marksObtained} / ${r.exam.totalMarks}` },
            { header: "Grade point", cell: (r) => (r.gradePoint != null ? r.gradePoint.toFixed(2) : "—") },
          ]}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-primary">Transcript</h2>
        <DataTable
          rows={transcript.data?.completedCourses ?? []}
          rowKey={(c) => c.id}
          emptyIcon={Award}
          emptyTitle="Nothing completed yet"
          emptyText="Courses move here once your faculty finalises the grades."
          columns={[
            { header: "Code", cell: (c) => <span className="font-medium text-primary">{c.section.course.code}</span> },
            { header: "Course", cell: (c) => c.section.course.title },
            { header: "Credits", cell: (c) => c.section.course.creditHours ?? "—" },
            { header: "Status", cell: () => <StatusBadge status="COMPLETED" /> },
          ]}
        />
      </section>
    </>
  );
}