import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      links={[
        { href: "/admin", label: "Overview", icon: "home" },
        { href: "/admin/manage", label: "Manage users", icon: "users" },
        { href: "/admin/fees", label: "Fees", icon: "card" },
        { href: "/admin/reports", label: "Reports", icon: "chart" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}