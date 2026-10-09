import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/overview";

export const metadata: Metadata = { title: "Registrar's overview" };

export default function AdminPage() {
  return <AdminOverview />;
}