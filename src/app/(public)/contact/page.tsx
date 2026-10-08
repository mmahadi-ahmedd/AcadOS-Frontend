import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/shared/page-header";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Write to the registrar's office about enrolment, fees, results or anything else.",
};

const TIPS = [
  "Include your student ID so we can find your record quickly.",
  "For fee questions, say which semester it is about.",
  "For results, mention the course code and the exam.",
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Write to the registrar's office"
        description="Questions about enrolment, fees or results are best sent here. Tell us a little about what you need."
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="contact-form-title" className="space-y-6">
          <h2 id="contact-form-title" className="text-2xl font-semibold text-primary">
            Send a message
          </h2>
          <ContactForm />
        </section>

        <aside className="space-y-6 self-start rounded-md border bg-card p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
              <Mail className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-primary">Email</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-primary">Before you write</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
