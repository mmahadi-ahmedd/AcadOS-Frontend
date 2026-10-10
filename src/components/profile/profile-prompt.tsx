"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FacultyStep, StudentStep } from "@/components/auth/register-wizard";
import { createInstructorProfile, createStudentProfile } from "@/lib/auth-api";
import { errorText, getData } from "@/lib/fetchers";
import type { FacultyDetailsValues, StudentDetailsValues } from "@/lib/validators/auth";
import { useAuthStore } from "@/store/auth-store";

interface MeCheck {
  student?: unknown;
  instructor?: unknown;
}

// Shown on the dashboard for anyone who skipped their academic details at sign-up
export function ProfilePrompt() {
  const role = useAuthStore((s) => s.user?.role);
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState(false);
  const applies = role === "STUDENT" || role === "INSTRUCTOR";

  const me = useQuery({ queryKey: ["me"], queryFn: () => getData<MeCheck>("/users/me"), enabled: applies });

  const done = () => {
    toast.success("Profile completed");
    queryClient.invalidateQueries();
  };
  const saveStudent = useMutation({
    mutationFn: (v: StudentDetailsValues) =>
      createStudentProfile({ departmentId: v.departmentId, programId: v.programId, enrollYear: Number(v.enrollYear) }),
    onSuccess: done,
    onError: (e) => toast.error(errorText(e)),
  });
  const saveFaculty = useMutation({
    mutationFn: (v: FacultyDetailsValues) =>
      createInstructorProfile({ departmentId: v.departmentId, designation: v.designation || undefined }),
    onSuccess: done,
    onError: (e) => toast.error(errorText(e)),
  });

  const missing = role === "STUDENT" ? !me.data?.student : !me.data?.instructor;
  if (!applies || !me.data || !missing || dismissed) return null;

  return (
    <section className="rounded-md border border-gold/60 bg-card p-5">
      <h2 className="text-xl font-semibold text-primary">Finish setting up your profile</h2>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">
        {role === "STUDENT"
          ? "Choose your department and programme. Your student ID is created for you."
          : "Choose your department. Your employee ID is created for you."}{" "}
        Courses and attendance stay locked until this is done.
      </p>
      {role === "STUDENT" ? (
        <StudentStep submitting={saveStudent.isPending} onSkip={() => setDismissed(true)} onSubmit={(v) => saveStudent.mutate(v)} />
      ) : (
        <FacultyStep submitting={saveFaculty.isPending} onSkip={() => setDismissed(true)} onSubmit={(v) => saveFaculty.mutate(v)} />
      )}
    </section>
  );
}