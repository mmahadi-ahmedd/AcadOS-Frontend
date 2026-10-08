import { Suspense } from "react";
import { CatalogHighlights } from "@/components/catalog/catalog-highlights";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { CtaBand } from "@/components/home/cta-band";
import { Hero } from "@/components/home/hero";
import { RoleCards } from "@/components/home/role-cards";
import { SectionHeading } from "@/components/shared/section-heading";

export default function HomePage() {
  return (
    <>
      <Hero />
      <RoleCards />

      <section className="mx-auto max-w-6xl space-y-8 px-5 pt-20">
        <SectionHeading
          eyebrow="The catalogue"
          title="What the university teaches this term"
          description="Straight from the live record, so it is always the same list students see when they enrol."
        />
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogHighlights />
        </Suspense>
      </section>

      <CtaBand />
    </>
  );
}
