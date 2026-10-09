import { callbackHandler } from "@/lib/server/payment-callback";

export const POST = callbackHandler("cancel");
export const GET = POST;