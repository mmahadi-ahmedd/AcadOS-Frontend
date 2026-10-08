import Link from "next/link";
import { BookOpenCheck, GraduationCap, Landmark } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const ROLES = [
  {
    icon: GraduationCap,
    title: "Students",
    text: "Enrol in sections, follow your attendance, read your results and pay semester fees online.",
  },
  {
    icon: BookOpenCheck,
    title: "Faculty",
    text: "See your own sections, mark attendance, set exams and enter marks. Grade points are worked out for you.",
  },
  {
    icon: Landmark,
    title: "Registrar's office",
    text: "Set up departments, programmes, courses and sections. Generate fees and review every change in the audit log.",
  },
];

export function RoleCards() {
  return (
    <section className="mx-auto max-w-6xl space-y-10 px-5 pt-20">
      <SectionHeading
        eyebrow="Who it is for"
        title="Built around three kinds of people"
        description="Everyone sees the part of the record that is theirs, and nothing more."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {ROLES.map((role) => (
          <article key={role.title} className="rounded-md border bg-card p-6">
            <span className="flex size-11 items-center justify-center rounded-md bg-secondary text-primary">
              <role.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-xl font-semibold text-primary">{role.title}</h3>
            <p className="mt-2 text-muted-foreground">{role.text}</p>
          </article>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Want to see it from the inside?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Every role has a one-click demo account.
        </Link>
      </p>
    </section>
  );
}
