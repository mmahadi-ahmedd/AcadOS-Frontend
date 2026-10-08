import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-serif text-7xl font-semibold text-gold">404</p>
      <h1 className="text-4xl font-semibold text-primary">That page is not in the register</h1>
      <p className="max-w-md text-muted-foreground">
        The link may be out of date, or the page may have moved. Try the home page or the course
        catalogue instead.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/" className={buttonVariants()}>
          Back to home
        </Link>
        <Link href="/programmes" className={buttonVariants({ variant: "outline" })}>
          Browse programmes
        </Link>
      </div>
    </main>
  );
}
