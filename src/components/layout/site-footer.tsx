import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm space-y-3">
          <p className="flex items-center gap-2 font-serif text-xl font-semibold">
            <GraduationCap className="size-6 text-gold" aria-hidden />
            {SITE_NAME}
          </p>
          <p className="text-sm leading-relaxed text-primary-foreground/70">
            Enrolment, attendance, grading, transcripts and semester fees for the registrar&apos;s
            office, faculty and students.
          </p>
        </div>

        <FooterColumn title="Explore">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-gold">
                {link.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Your account">
          <li>
            <Link href="/login" className="hover:text-gold">
              Sign in
            </Link>
          </li>
          <li>
            <Link href="/register" className="hover:text-gold">
              Create an account
            </Link>
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        &copy; 2026 {SITE_NAME}. Built as a course project.
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">{title}</p>
      <ul className="space-y-2 text-sm text-primary-foreground/80">{children}</ul>
    </div>
  );
}
