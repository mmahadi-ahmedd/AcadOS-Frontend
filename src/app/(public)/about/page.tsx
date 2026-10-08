import type { Metadata } from "next";
import { Check, Eye, Layers, Minus, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why AcadOS exists, how it keeps academic records trustworthy, and who can do what in the system.",
};

const PRINCIPLES = [
  {
    icon: Layers,
    title: "One record",
    text: "Enrolment, attendance, marks and fees all hang off the same student record, so nobody reconciles spreadsheets at the end of term.",
  },
  {
    icon: ShieldCheck,
    title: "Clear boundaries",
    text: "Students, faculty and the registrar's office each get their own area. A faculty member can only touch their own sections.",
  },
  {
    icon: Eye,
    title: "Nothing quietly disappears",
    text: "Records are archived rather than erased, and important changes, like a role being updated, are written to an audit log.",
  },
];

// true = allowed. Mirrors the permissions enforced by the API.
const PERMISSIONS: { action: string; student: boolean; faculty: boolean; registrar: boolean }[] = [
  { action: "Browse the course catalogue", student: true, faculty: true, registrar: true },
  { action: "Enrol in a section and drop it", student: true, faculty: false, registrar: false },
  { action: "Read own results, transcript and CGPA", student: true, faculty: false, registrar: false },
  { action: "Pay semester fees", student: true, faculty: false, registrar: false },
  { action: "Mark attendance for an assigned section", student: false, faculty: true, registrar: false },
  { action: "Create exams and enter marks", student: false, faculty: true, registrar: false },
  { action: "View a section's enrolment and attendance", student: false, faculty: true, registrar: true },
  { action: "Manage departments, programmes, courses and sections", student: false, faculty: false, registrar: true },
  { action: "Generate fees and review payments", student: false, faculty: false, registrar: true },
  { action: "Manage users and read the audit log", student: false, faculty: false, registrar: true },
];

function Mark({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <>
      <Check className="mx-auto size-5 text-primary" aria-hidden />
      <span className="sr-only">Yes</span>
    </>
  ) : (
    <>
      <Minus className="mx-auto size-5 text-muted-foreground/50" aria-hidden />
      <span className="sr-only">No</span>
    </>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About AcadOS"
        title="A single record for the whole academic year"
        description="AcadOS replaces the pile of spreadsheets, notice boards and paper registers that most departments quietly run on."
      />

      <div className="mx-auto max-w-6xl space-y-20 px-5 py-14">
        <section className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Why it exists" title="Records that agree with each other" />
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              A student&apos;s semester touches a lot of hands. One person approves the enrolment,
              another takes attendance, a third enters marks, and someone else chases the fee. When
              each lives in its own file, mistakes are easy and finding them is slow.
            </p>
            <p>
              AcadOS keeps all of it in one place and lets each person see only what they need.
              Seat limits and prerequisites are checked at the moment of enrolment, grade points are
              worked out from marks, and every fee payment is confirmed by the payment gateway rather
              than typed in by hand.
            </p>
          </div>
        </section>

        <section className="space-y-10">
          <SectionHeading eyebrow="How it works" title="Three principles behind the system" />
          <div className="grid gap-5 md:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <article key={principle.title} className="rounded-md border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-md bg-secondary text-primary">
                  <principle.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-primary">{principle.title}</h3>
                <p className="mt-2 text-muted-foreground">{principle.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Roles"
            title="Who can do what"
            description="These are the same rules the server enforces, not just what the screens hide."
          />
          <div className="overflow-x-auto rounded-md border bg-card">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <caption className="sr-only">Permissions by role</caption>
              <thead className="border-b bg-secondary/60 text-primary">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Action
                  </th>
                  <th scope="col" className="w-24 px-4 py-3 text-center font-semibold">
                    Student
                  </th>
                  <th scope="col" className="w-24 px-4 py-3 text-center font-semibold">
                    Faculty
                  </th>
                  <th scope="col" className="w-24 px-4 py-3 text-center font-semibold">
                    Registrar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {PERMISSIONS.map((row) => (
                  <tr key={row.action}>
                    <th scope="row" className="px-4 py-3 font-normal">
                      {row.action}
                    </th>
                    <td className="px-4 py-3">
                      <Mark allowed={row.student} />
                    </td>
                    <td className="px-4 py-3">
                      <Mark allowed={row.faculty} />
                    </td>
                    <td className="px-4 py-3">
                      <Mark allowed={row.registrar} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
