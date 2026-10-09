"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Layers, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashHeading } from "@/components/shared/dash-heading";
import { DataTable } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { AttendanceDialog } from "@/components/instructor/attendance-dialog";
import { errorText, getData, send } from "@/lib/fetchers";
import type { SectionRow } from "@/types/academic";

export function MySections() {
  const queryClient = useQueryClient();
  const [attendanceFor, setAttendanceFor] = useState<SectionRow | null>(null);

  const sections = useQuery({
    queryKey: ["instructor", "sections"],
    queryFn: () => getData<SectionRow[]>("/sections/my-sections"),
  });

  const finalize = useMutation({
    mutationFn: (sectionId: string) => send("patch", `/results/finalize/${sectionId}`),
    onSuccess: () => {
      toast.success("Grades finalised and CGPAs updated");
      queryClient.invalidateQueries({ queryKey: ["instructor"] });
    },
    onError: (e) => toast.error(errorText(e)),
  });

  const rows = sections.data ?? [];
  const students = rows.reduce((sum, s) => sum + (s._count?.enrollments ?? 0), 0);

  return (
    <>
      <DashHeading title="My sections" text="The classes you teach, with attendance and grading close at hand." />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Sections assigned" value={rows.length} icon={Layers} />
        <StatCard label="Students across sections" value={students} icon={Users} />
      </div>

      {sections.isLoading ? (
        <Skeleton className="h-56" />
      ) : sections.isError ? (
        <p className="text-destructive">{errorText(sections.error)}</p>
      ) : (
        <DataTable
          rows={rows}
          rowKey={(s) => s.id}
          emptyIcon={ClipboardList}
          emptyTitle="No sections assigned"
          emptyText="Once the registrar assigns you a section it will be listed here."
          columns={[
            { header: "Course", cell: (s) => <><span className="font-medium text-primary">{s.course?.code}</span> {s.course?.title}</> },
            { header: "Section", cell: (s) => s.sectionName ?? s.name ?? "—" },
            { header: "Term", cell: (s) => s.semester?.name ?? "—" },
            { header: "Students", cell: (s) => `${s._count?.enrollments ?? 0}${s.capacity ? ` / ${s.capacity}` : ""}` },
            {
              header: "",
              cell: (s) => (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setAttendanceFor(s)}>
                    Attendance
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={finalize.isPending}
                    onClick={() => window.confirm("Finalise grades for this section? This completes every enrolment.") && finalize.mutate(s.id)}
                  >
                    Finalise grades
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <AttendanceDialog section={attendanceFor} onClose={() => setAttendanceFor(null)} />
    </>
  );
}