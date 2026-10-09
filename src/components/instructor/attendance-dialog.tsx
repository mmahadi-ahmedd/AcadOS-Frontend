"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { errorText, getData, send } from "@/lib/fetchers";
import type { SectionRow } from "@/types/academic";

interface Roster {
  id: string;
  studentId: string;
  status: string;
  student: { user: { name: string } };
}

const choices = ["PRESENT", "LATE", "ABSENT"];

interface AttendanceDialogProps {
  section: SectionRow | null;
  onClose: () => void;
}

export function AttendanceDialog({ section, onClose }: AttendanceDialogProps) {
  return (
    <Dialog open={!!section} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {/* Mounting the form only when a section is chosen gives it fresh state each time */}
        {section && <AttendanceForm key={section.id} section={section} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function AttendanceForm({ section, onClose }: { section: SectionRow; onClose: () => void }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState<Record<string, string>>({});

  const roster = useQuery({
    queryKey: ["instructor", "roster", section.id],
    queryFn: () => getData<Roster[]>(`/enrollments/section/${section.id}`),
  });
  const students = (roster.data ?? []).filter((r) => r.status === "ENROLLED");

  const save = useMutation({
    mutationFn: () =>
      send("post", "/attendance", {
        sectionId: section.id,
        date: new Date(date).toISOString(),
        records: students.map((s) => ({ studentId: s.studentId, status: marks[s.studentId] ?? "PRESENT" })),
      }),
    onSuccess: () => {
      toast.success("Attendance saved");
      onClose();
    },
    onError: (e) => toast.error(errorText(e)),
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Take attendance</DialogTitle>
        <DialogDescription>
          {section.course?.code} · {section.course?.title}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <Label htmlFor="att-date">Class date</Label>
        <Input id="att-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {roster.isLoading ? (
        <Skeleton className="h-32" />
      ) : students.length === 0 ? (
        <p className="py-4 text-center text-muted-foreground">No students are enrolled in this section yet.</p>
      ) : (
        <ul className="divide-y rounded-md border">
          {students.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
              <span className="text-sm font-medium text-primary">{s.student.user.name}</span>
              <div className="flex gap-1">
                {choices.map((choice) => (
                  <Button
                    key={choice}
                    type="button"
                    size="sm"
                    variant={(marks[s.studentId] ?? "PRESENT") === choice ? "default" : "outline"}
                    onClick={() => setMarks((m) => ({ ...m, [s.studentId]: choice }))}
                  >
                    {choice.charAt(0) + choice.slice(1).toLowerCase()}
                  </Button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!date || students.length === 0 || save.isPending} onClick={() => save.mutate()}>
          {save.isPending ? "Saving…" : "Save attendance"}
        </Button>
      </div>
    </>
  );
}