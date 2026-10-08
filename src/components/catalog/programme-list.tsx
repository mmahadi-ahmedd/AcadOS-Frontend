import { GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { getCatalog } from "@/lib/server/catalog";

export async function ProgrammeList() {
  const { programmes } = await getCatalog();

  if (programmes.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No programmes published yet"
        description="Degree programmes appear here as soon as the registrar's office adds them."
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {programmes.map((programme) => (
        <li key={programme.id} className="rounded-md border bg-card p-5">
          <p className="font-mono text-xs font-medium tracking-wider text-gold">
            {programme.department.code}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-snug text-primary">{programme.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {programme.degreeLevel} &middot; {programme.totalCredits} credits
          </p>
        </li>
      ))}
    </ul>
  );
}
