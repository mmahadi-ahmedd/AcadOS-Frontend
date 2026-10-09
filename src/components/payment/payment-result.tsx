"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function PaymentResult({ kind }: { kind: "success" | "cancel" }) {
  const search = useSearchParams();
  const tran = search.get("tran");
  const failed = search.get("reason") === "failed";
  const ok = kind === "success";
  const Icon = ok ? CheckCircle2 : XCircle;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <Icon className={`size-14 ${ok ? "text-emerald-600" : "text-destructive"}`} aria-hidden />
      <h1 className="mt-4 text-3xl font-semibold text-primary">
        {ok ? "Payment received" : failed ? "Payment did not go through" : "Payment cancelled"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {ok
          ? "Thank you. The registrar's office has been notified and your fee is now marked as paid."
          : "Nothing was charged. You can try again from your fees page whenever you are ready."}
      </p>
      {tran && <p className="mt-3 text-xs text-muted-foreground">Reference: {tran}</p>}
      <Link href="/student/payments" className={`${buttonVariants()} mt-6`}>
        Back to my fees
      </Link>
    </div>
  );
}