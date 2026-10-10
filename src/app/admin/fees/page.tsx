import type { Metadata } from "next";
import { FeesPanel } from "@/components/admin/fees-panel";

export const metadata: Metadata = { title: "Student fees" };

export default function AdminFeesPage() {
  return <FeesPanel />;
}