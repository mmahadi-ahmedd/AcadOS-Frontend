import type { Metadata } from "next";
import { StudentProgress } from "@/components/student/progress";

export const metadata: Metadata = { title: "My progress" };

export default function ProgressPage() {
  return <StudentProgress />;
}