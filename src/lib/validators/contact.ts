import { z } from "zod";

export const CONTACT_TOPICS = [
  { value: "enrolment", label: "Course enrolment" },
  { value: "fees", label: "Fees and payments" },
  { value: "results", label: "Results and transcripts" },
  { value: "other", label: "Something else" },
];

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name"),
  email: z.string().email("Enter a valid email address"),
  topic: z.string().min(1, "Choose a topic"),
  message: z.string().trim().min(20, "A couple of sentences helps us help you (20 characters at least)"),
});
export type ContactValues = z.infer<typeof contactSchema>;
