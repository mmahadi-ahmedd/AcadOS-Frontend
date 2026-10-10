import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      links={[
        { href: "/student", label: "My courses", icon: "book" },
        { href: "/student/payments", label: "Fees & payments", icon: "card" },
        { href: "/student/profile", label: "Profile", icon: "user" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}