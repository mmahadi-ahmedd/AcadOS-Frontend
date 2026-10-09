import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = { title: "Profile and settings" };

export default function StudentProfilePage() {
  return <ProfileForm />;
}