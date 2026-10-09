import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  note?: string;
}

export function StatCard({ label, value, icon: Icon, note }: StatCardProps) {
  return (
    <div className="rounded-md border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="size-5 text-gold" aria-hidden />
      </div>
      <p className="mt-2 text-3xl font-semibold text-primary">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}