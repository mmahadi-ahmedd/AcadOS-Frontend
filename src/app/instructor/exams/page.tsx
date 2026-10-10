import { Suspense } from "react";
import type { Metadata } from "next";
import { ExamsAndMarks } from "@/components/instructor/exams";

export const metadata: Metadata = { title: "Exams and marks" };

export default function ExamsPage() {
  return (
    <Suspense>
      <ExamsAndMarks />
    </Suspense>
  );
}