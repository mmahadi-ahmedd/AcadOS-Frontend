import type { Metadata } from "next";
import { CalendarCheck, ClipboardList, FileClock, Landmark, ScrollText, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { GRADE_SCALE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Enrolment, attendance, examinations, transcripts, fee payment and records: what AcadOS handles each term.",
};

const SERVICES = [
  {
    icon: ClipboardList,
    title: "Course enrolment",
    points: [
      "Students enrol in a specific section, not just a course",
      "Prerequisites are checked before a seat is given",
      "Seat limits hold even when many students enrol at once",
      "Dropping a section is one click",
    ],
  },
  {
    icon: CalendarCheck,
    title: "Attendance",
    points: [
      "Faculty mark a whole class in one go",
      "Present, absent, late or excused for each student",
      "Students can look back over their own record",
    ],
  },
  {
    icon: ScrollText,
    title: "Examinations and grading",
    points: [
      "Exams are set per section with total marks and a date",
      "Marks are entered in bulk and can be corrected",
      "Grade points are worked out automatically",
    ],
  },
  {
    icon: Landmark,
    title: "Transcripts and CGPA",
    points: [
      "Finalising a section marks its enrolments as completed",
      "CGPA is weighted by each course's credit hours",
      "Students see completed courses and their CGPA together",
    ],
  },
  {
    icon: Wallet,
    title: "Fees and payments",
    points: [
      "One fee per student for each semester",
      "Paid online through the SSLCommerz payment gateway",
      "The gateway confirms each payment before it is marked paid",
    ],
  },
  {
    icon: FileClock,
    title: "Records and audit trail",
    points: [
      "Records are archived instead of deleted",
      "Role changes and removals are written to an audit log",
      "The registrar's office can search and page through the log",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What AcadOS takes care of each term"
        description="From the first enrolment to the final transcript, here is what the system handles and who it helps."
      />

      <div className="mx-auto max-w-6xl space-y-20 px-5 py-14">
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.title} className="rounded-md border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-md bg-secondary text-primary">
                <service.icon className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-primary">{service.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {service.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Grading"
            title="How marks become grade points"
            description="Every mark is turned into a percentage of the exam's total, then into a grade point on this scale."
          />
          <div className="overflow-x-auto rounded-md border bg-card">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <caption className="sr-only">Grade scale</caption>
              <thead className="border-b bg-secondary/60 text-primary">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Marks
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Letter grade
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Grade point
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {GRADE_SCALE.map((grade) => (
                  <tr key={grade.letter}>
                    <td className="px-4 py-3">{grade.range}</td>
                    <td className="px-4 py-3 font-medium">{grade.letter}</td>
                    <td className="px-4 py-3 font-mono">{grade.points}</td>
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
