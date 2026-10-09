import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-800",
  SUCCESS: "bg-emerald-100 text-emerald-800",
  ENROLLED: "bg-emerald-100 text-emerald-800",
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PRESENT: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  UNPAID: "bg-amber-100 text-amber-800",
  LATE: "bg-amber-100 text-amber-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-red-100 text-red-800",
  DROPPED: "bg-red-100 text-red-800",
  ABSENT: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[status.toUpperCase()] ?? "bg-secondary text-primary"
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}