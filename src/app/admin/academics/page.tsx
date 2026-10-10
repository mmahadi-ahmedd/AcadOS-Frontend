import { Suspense } from "react";
import type { Metadata } from "next";
import { Academics } from "@/components/admin/academics";

export const metadata: Metadata = { title: "Academic setup" };

export default function AcademicsPage() {
  return (
    <Suspense>
      <Academics />
    </Suspense>
  );
}