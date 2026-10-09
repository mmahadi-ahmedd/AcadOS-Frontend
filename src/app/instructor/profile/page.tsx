import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = { title: "Faculty profile" };

export default function InstructorProfilePage() {
  return <ProfileForm />;
}