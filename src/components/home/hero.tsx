import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ruledPaper } from "@/lib/ui";

const SEMESTER_STEPS = [
  { title: "Enrol", text: "Students pick their sections. Prerequisites and seat limits are checked for them." },
  { title: "Attend", text: "Faculty mark attendance for every class day." },
  { title: "Examine", text: "Exams are set per section and marks are entered in bulk." },
  { title: "Grade", text: "Marks become grade points, and CGPA updates when a section is finalised." },
  { title: "Settle", text: "The semester fee is paid online and confirmed by the payment gateway." },
];

export function Hero() {
  return (
    <section className="border-b" style={ruledPaper}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div className="space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">
            University management system
          </p>
          <h1 className="text-5xl font-semibold leading-[1.1] text-primary sm:text-6xl">
            The academic year, kept in order.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            AcadOS gives the registrar&apos;s office, faculty and students one shared record: course
            enrolment, attendance, grades, transcripts and semester fees, all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/programmes" className={buttonVariants({ size: "lg" })}>
              Browse programmes
            </Link>
            <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Sign in
            </Link>
          </div>
        </div>

        <div className="rounded-md border bg-card p-6 shadow-sm sm:p-8">
          <p className="font-serif text-xl font-semibold text-primary">How a semester runs</p>
          <ol className="mt-5 space-y-5 border-l-2 border-gold/40 pl-6">
            {SEMESTER_STEPS.map((step, index) => (
              <li key={step.title} className="relative">
                <span className="absolute -left-[2.15rem] top-0.5 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="font-semibold text-primary">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
