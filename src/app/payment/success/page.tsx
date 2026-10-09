import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentResult } from "@/components/payment/payment-result";

export const metadata: Metadata = { title: "Payment received" };

export default function SuccessPage() {
  return (
    <Suspense>
      <PaymentResult kind="success" />
    </Suspense>
  );
}