import { callbackHandler } from "@/lib/server/payment-callback";

export const POST = callbackHandler("fail");
export const GET = POST;