import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogSkeleton, ProgrammeListSkeleton } from "@/components/catalog/catalog-skeleton";
import { CourseCatalogue } from "@/components/catalog/course-catalogue";
import { ProgrammeList } from "@/components/catalog/programme-list";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Programmes and courses",
  description:
    "Browse the degree programmes and the full course catalogue, with credit hours and prerequisites.",
};

export default function ProgrammesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Programmes and courses"
        title="What you can study here"
        description="Every degree programme and course the university currently offers, with credit hours and prerequisites."
      />

      <div className="mx-auto max-w-6xl space-y-16 px-5 py-14">
        <section className="space-y-6">
          <SectionHeading eyebrow="Degrees" title="Degree programmes" />
          <Suspense fallback={<ProgrammeListSkeleton />}>
            <ProgrammeList />
          </Suspense>
        </section>

        <section id="courses" className="scroll-mt-24 space-y-6">
          <SectionHeading
            eyebrow="Course catalogue"
            title="Find a course"
            description="Search by title or code, narrow by department, and share the link to any view."
          />
          <Suspense fallback={<CatalogSkeleton />}>
            <CourseCatalogue searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
