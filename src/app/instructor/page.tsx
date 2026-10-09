import type { Metadata } from "next";
import { MySections } from "@/components/instructor/my-sections";

export const metadata: Metadata = { title: "My sections" };

export default function InstructorPage() {
  return <MySections />;
}