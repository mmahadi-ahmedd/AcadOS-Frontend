import type { Metadata } from "next";
import { UsersPanel } from "@/components/admin/users-panel";

export const metadata: Metadata = { title: "Manage accounts" };

export default function ManagePage() {
  return <UsersPanel />;
}