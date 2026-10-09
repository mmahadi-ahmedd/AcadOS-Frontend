import type { Metadata } from "next";
import { StudentCourses } from "@/components/student/courses";

export const metadata: Metadata = { title: "My courses" };

export default function StudentPage() {
  return <StudentCourses />;
}