import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[5fr_6fr]">
      <aside className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl">
          <GraduationCap className="size-6 text-gold" aria-hidden />
          {SITE_NAME}
        </Link>

        <div className="max-w-md space-y-4">
          <p className="font-serif text-3xl leading-snug">
            One record for every student, from first enrolment to final transcript.
          </p>
          <p className="text-sm leading-relaxed text-primary-foreground/70">
            Registrar staff, faculty and students all work from the same academic record, so
            attendance, grades and fees never drift apart.
          </p>
        </div>

        <p className="text-xs text-primary-foreground/60">Academic records and fee management</p>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <Link href="/" className="mb-8 flex items-center gap-2 font-serif text-lg text-primary lg:hidden">
          <GraduationCap className="size-5 text-gold" aria-hidden />
          {SITE_NAME}
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">{children}</div>
      </main>
    </div>
  );
}
