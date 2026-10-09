"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, CheckCircle2, Library } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashHeading } from "@/components/shared/dash-heading";
import { DataTable } from "@/components/shared/data-table";
import { Pager } from "@/components/shared/pager";
import { SearchBox } from "@/components/shared/search-box";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useUrlParams } from "@/hooks/use-url-params";
import { errorText, getData, getPage, send } from "@/lib/fetchers";
import type { EnrollmentRow, SectionRow } from "@/types/academic";

const LIMIT = 8;
const sectionLabel = (s: SectionRow) => s.sectionName ?? s.name ?? "—";

export function StudentCourses() {
  const url = useUrlParams();
  const queryClient = useQueryClient();
  const q = url.get("q").toLowerCase();

  const mine = useQuery({
    queryKey: ["student", "enrollments"],
    queryFn: () => getData<EnrollmentRow[]>("/enrollments/my-enrollments"),
  });
  const open = useQuery({
    queryKey: ["student", "sections", url.page],
    queryFn: () => getPage<SectionRow>("/sections", { page: url.page, limit: LIMIT }),
    placeholderData: (previous) => previous,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["student"] });
  const enrol = useMutation({
    mutationFn: (sectionId: string) => send("post", "/enrollments", { sectionId }),
    onSuccess: () => {
      toast.success("You are enrolled");
      refresh();
    },
    onError: (e) => toast.error(errorText(e)),
  });
  const drop = useMutation({
    mutationFn: (id: string) => send("patch", `/enrollments/${id}/drop`),
    onSuccess: () => {
      toast.success("Course dropped");
      refresh();
    },
    onError: (e) => toast.error(errorText(e)),
  });

  const enrolments = mine.data ?? [];
  const active = enrolments.filter((e) => e.status === "ENROLLED");
  const credits = active.reduce((sum, e) => sum + (e.section.course?.creditHours ?? 0), 0);
  const takenIds = new Set(active.map((e) => e.section.id));
  const sections = (open.data?.rows ?? []).filter(
    (s) => !q || `${s.course?.code} ${s.course?.title}`.toLowerCase().includes(q)
  );

  return (
    <>
      <DashHeading title="My courses" text="What you are taking this term, and what you can still add." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Courses enrolled" value={active.length} icon={BookOpen} />
        <StatCard label="Credit hours" value={credits} icon={Library} />
        <StatCard label="Completed" value={enrolments.filter((e) => e.status === "COMPLETED").length} icon={CheckCircle2} />
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-primary">My enrolments</h2>
        {mine.isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <DataTable
            rows={enrolments}
            rowKey={(e) => e.id}
            emptyIcon={BookOpen}
            emptyTitle="No courses yet"
            emptyText="Pick a section from the list below to get started."
            columns={[
              { header: "Course", cell: (e) => <><span className="font-medium text-primary">{e.section.course?.code}</span> {e.section.course?.title}</> },
              { header: "Term", cell: (e) => e.section.semester?.name ?? "—" },
              { header: "Credits", cell: (e) => e.section.course?.creditHours },
              { header: "Status", cell: (e) => <StatusBadge status={e.status} /> },
              {
                header: "",
                cell: (e) =>
                  e.status === "ENROLLED" && (
                    <Button variant="outline" size="sm" disabled={drop.isPending} onClick={() => window.confirm("Drop this course?") && drop.mutate(e.id)}>
                      Drop
                    </Button>
                  ),
              },
            ]}
          />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-primary">Open sections</h2>
          <SearchBox placeholder="Search by code or title" />
        </div>
        {open.isLoading ? (
          <Skeleton className="h-64" />
        ) : open.isError ? (
          <p className="text-destructive">{errorText(open.error)}</p>
        ) : (
          <>
            <DataTable
              rows={sections}
              rowKey={(s) => s.id}
              emptyIcon={Library}
              emptyTitle="No sections match"
              emptyText="Clear the search or check the next page."
              columns={[
                { header: "Course", cell: (s) => <><span className="font-medium text-primary">{s.course?.code}</span> {s.course?.title}</> },
                { header: "Section", cell: sectionLabel },
                { header: "Faculty", cell: (s) => s.instructor?.user?.name ?? "To be announced" },
                { header: "Seats", cell: (s) => (s.capacity ? `${s._count?.enrollments ?? 0} / ${s.capacity}` : "—") },
                {
                  header: "",
                  cell: (s) =>
                    takenIds.has(s.id) ? (
                      <StatusBadge status="ENROLLED" />
                    ) : (
                      <Button size="sm" disabled={enrol.isPending} onClick={() => enrol.mutate(s.id)}>
                        Enrol
                      </Button>
                    ),
                },
              ]}
            />
            <Pager total={open.data?.meta?.total ?? 0} limit={LIMIT} />
          </>
        )}
      </section>
    </>
  );
}