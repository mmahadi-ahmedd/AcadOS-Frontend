import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-5">
      <div className="flex flex-col items-start justify-between gap-6 rounded-md bg-primary px-8 py-10 text-primary-foreground md:flex-row md:items-center">
        <div className="max-w-xl space-y-2">
          <h2 className="text-3xl font-semibold">Want to look around first?</h2>
          <p className="text-primary-foreground/75">
            The sign-in page has demo accounts for the registrar, faculty and students, so you can
            see each dashboard without creating anything.
          </p>
        </div>
        <Link href="/login" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          Open the sign-in page
        </Link>
      </div>
    </section>
  );
}
