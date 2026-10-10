"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ClipboardCheck, Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DashHeading } from "@/components/shared/dash-heading";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { SelectField } from "@/components/shared/select-field";
import { useUrlParams } from "@/hooks/use-url-params";
import { errorText, getData, send } from "@/lib/fetchers";
import { shortDate } from "@/lib/format";
import type { SectionRow } from "@/types/academic";

interface ExamRow {
  id: string;
  title: string;
  totalMarks: number;
  examDate: string;
}
interface Roster {
  id: string;
  studentId: string;
  status: string;
  student: { user: { name: string } };
}

export function ExamsAndMarks() {
  const url = useUrlParams();
  const sectionId = url.get("section");
  const [creating, setCreating] = useState(false);
  const [marking, setMarking] = useState<ExamRow | null>(null);

  const sections = useQuery({
    queryKey: ["instructor", "sections"],
    queryFn: () => getData<SectionRow[]>("/sections/my-sections"),
  });
  const exams = useQuery({
    queryKey: ["instructor", "exams", sectionId],
    queryFn: () => getData<ExamRow[]>(`/exams/section/${sectionId}`),
    enabled: !!sectionId,
  });

  const options = (sections.data ?? []).map((s) => ({
    value: s.id,
    label: `${s.course?.code} · ${s.course?.title} (${s.sectionCode ?? "section"})`,
  }));

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <DashHeading title="Exams and marks" text="Set an exam for a section, then enter each student's marks." />
        <Button disabled={!sectionId} onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden /> New exam
        </Button>
      </div>

      <div className="w-full sm:max-w-md">
        <SelectField
          id="exam-section"
          value={sectionId}
          onChange={(next) => url.set({ section: next })}
          options={options}
          placeholder={sections.isLoading ? "Loading sections…" : "Choose a section"}
        />
      </div>

      {!sectionId ? (
        <EmptyState icon={ClipboardCheck} title="Pick a section" description="Choose one of your sections to see and add its exams." />
      ) : exams.isLoading ? (
        <Skeleton className="h-48" />
      ) : exams.isError ? (
        <p className="text-destructive">{errorText(exams.error)}</p>
      ) : (
        <DataTable
          rows={exams.data ?? []}
          rowKey={(e) => e.id}
          emptyIcon={ClipboardCheck}
          emptyTitle="No exams yet"
          emptyText="Use New exam to add the first one for this section."
          columns={[
            { header: "Exam", cell: (e) => <span className="font-medium text-primary">{e.title}</span> },
            { header: "Date", cell: (e) => shortDate(e.examDate) },
            { header: "Total marks", cell: (e) => e.totalMarks },
            {
              header: "",
              cell: (e) => (
                <Button size="sm" onClick={() => setMarking(e)}>
                  Enter marks
                </Button>
              ),
            },
          ]}
        />
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="sm:max-w-md">
          {creating && <ExamForm sectionId={sectionId} onDone={() => setCreating(false)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!marking} onOpenChange={(open) => !open && setMarking(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {marking && <MarksForm exam={marking} sectionId={sectionId} onDone={() => setMarking(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

const examSchema = z.object({
  title: z.string().trim().min(1, "Give the exam a title"),
  totalMarks: z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) > 0, "Enter total marks as a whole number"),
  examDate: z.string().min(1, "Pick the exam date"),
});
type ExamValues = z.infer<typeof examSchema>;

function ExamForm({ sectionId, onDone }: { sectionId: string; onDone: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm<ExamValues>({ resolver: zodResolver(examSchema), defaultValues: { title: "", totalMarks: "", examDate: "" } });
  const errors = form.formState.errors;

  const create = useMutation({
    mutationFn: (v: ExamValues) =>
      send("post", "/exams", {
        sectionId,
        title: v.title.trim(),
        totalMarks: Number(v.totalMarks),
        examDate: new Date(v.examDate).toISOString(),
      }),
    onSuccess: () => {
      toast.success("Exam created");
      queryClient.invalidateQueries({ queryKey: ["instructor", "exams"] });
      onDone();
    },
    onError: (e) => toast.error(errorText(e)),
  });

  return (
    <form onSubmit={form.handleSubmit((v) => create.mutate(v))} className="space-y-4" noValidate>
      <DialogHeader>
        <DialogTitle>New exam</DialogTitle>
        <DialogDescription>It will be visible to the enrolled students once marks are entered.</DialogDescription>
      </DialogHeader>
      <div className="space-y-1.5">
        <Label htmlFor="exam-title">Title</Label>
        <Input id="exam-title" placeholder="Midterm" {...form.register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="exam-total">Total marks</Label>
        <Input id="exam-total" type="number" min="1" placeholder="100" {...form.register("totalMarks")} />
        {errors.totalMarks && <p className="text-sm text-destructive">{errors.totalMarks.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="exam-date">Exam date</Label>
        <Input id="exam-date" type="date" {...form.register("examDate")} />
        {errors.examDate && <p className="text-sm text-destructive">{errors.examDate.message}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? "Saving…" : "Create exam"}
        </Button>
      </div>
    </form>
  );
}

function MarksForm({ exam, sectionId, onDone }: { exam: ExamRow; sectionId: string; onDone: () => void }) {
  const [marks, setMarks] = useState<Record<string, string>>({});
  const roster = useQuery({
    queryKey: ["instructor", "roster", sectionId],
    queryFn: () => getData<Roster[]>(`/enrollments/section/${sectionId}`),
  });
  const students = (roster.data ?? []).filter((r) => r.status === "ENROLLED");

  const save = useMutation({
    mutationFn: (records: { studentId: string; marksObtained: number }[]) => send("post", "/results", { examId: exam.id, records }),
    onSuccess: () => {
      toast.success("Marks saved");
      onDone();
    },
    onError: (e) => toast.error(errorText(e)),
  });

  function submit() {
    const records = students
      .filter((s) => (marks[s.studentId] ?? "") !== "")
      .map((s) => ({ studentId: s.studentId, marksObtained: Number(marks[s.studentId]) }));
    if (records.length === 0) return toast.error("Enter at least one mark");
    const bad = records.find((r) => Number.isNaN(r.marksObtained) || r.marksObtained < 0 || r.marksObtained > exam.totalMarks);
    if (bad) return toast.error(`Marks must be between 0 and ${exam.totalMarks}`);
    save.mutate(records);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{exam.title}: enter marks</DialogTitle>
        <DialogDescription>Out of {exam.totalMarks}. Leave a box empty to skip that student.</DialogDescription>
      </DialogHeader>
      {roster.isLoading ? (
        <Skeleton className="h-32" />
      ) : students.length === 0 ? (
        <p className="py-4 text-center text-muted-foreground">No enrolled students in this section yet.</p>
      ) : (
        <ul className="divide-y rounded-md border">
          {students.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <span className="text-sm font-medium text-primary">{s.student.user.name}</span>
              <Input
                type="number"
                min="0"
                max={exam.totalMarks}
                aria-label={`Marks for ${s.student.user.name}`}
                className="w-24"
                value={marks[s.studentId] ?? ""}
                onChange={(e) => setMarks((m) => ({ ...m, [s.studentId]: e.target.value }))}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button disabled={students.length === 0 || save.isPending} onClick={submit}>
          {save.isPending ? "Saving…" : "Save marks"}
        </Button>
      </div>
    </>
  );
}