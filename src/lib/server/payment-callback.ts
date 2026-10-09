import { NextResponse, type NextRequest } from "next/server";

// SSLCommerz posts the browser back here. We tell the backend what happened,
// then bounce the student to a normal page with a GET redirect.
export function callbackHandler(kind: "success" | "fail" | "cancel") {
  return async (request: NextRequest, { params }: { params: Promise<{ tranId: string }> }) => {
    const { tranId } = await params;
    const ref = encodeURIComponent(tranId);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${kind}/${ref}`, { method: "POST" });
    } catch {
      // The IPN webhook can still settle the payment, so the redirect carries on
    }

    const target =
      kind === "success"
        ? `/payment/success?tran=${ref}`
        : `/payment/cancel?reason=${kind === "fail" ? "failed" : "cancelled"}&tran=${ref}`;
    return NextResponse.redirect(new URL(target, request.url), 303);
  };
}