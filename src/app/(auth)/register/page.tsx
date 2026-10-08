import type { Metadata } from "next";
import { RegisterWizard } from "@/components/auth/register-wizard";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage() {
  return <RegisterWizard />;
}
