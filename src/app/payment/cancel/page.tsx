import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentResult } from "@/components/payment/payment-result";

export const metadata: Metadata = { title: "Payment cancelled" };

export default function CancelPage() {
  return (
    <Suspense>
      <PaymentResult kind="cancel" />
    </Suspense>
  );
}