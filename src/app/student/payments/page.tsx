import type { Metadata } from "next";
import { StudentFees } from "@/components/student/fees";

export const metadata: Metadata = { title: "Fees and payments" };

export default function PaymentsPage() {
  return <StudentFees />;
}