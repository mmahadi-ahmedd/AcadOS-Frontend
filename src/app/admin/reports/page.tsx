import type { Metadata } from "next";
import { AuditPanel } from "@/components/admin/audit-panel";

export const metadata: Metadata = { title: "Reports and audit trail" };

export default function ReportsPage() {
  return <AuditPanel />;
}