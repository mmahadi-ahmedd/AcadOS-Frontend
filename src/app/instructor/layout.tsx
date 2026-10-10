import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      links={[
        { href: "/instructor", label: "My sections", icon: "list" },
        { href: "/instructor/analytics", label: "Results", icon: "chart" },
        { href: "/instructor/profile", label: "Profile", icon: "user" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}