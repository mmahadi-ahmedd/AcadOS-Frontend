import { callbackHandler } from "@/lib/server/payment-callback";

export const POST = callbackHandler("success");
export const GET = POST;