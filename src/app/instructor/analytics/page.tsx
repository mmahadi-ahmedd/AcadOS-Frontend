import type { Metadata } from "next";
import { InstructorAnalytics } from "@/components/instructor/analytics";

export const metadata: Metadata = { title: "Teaching analytics" };

export default function AnalyticsPage() {
  return <InstructorAnalytics />;
}