import type { Role } from "@/types";

export const SITE_NAME = "AcadOS";

// Messages from the contact form open in the visitor's email app, addressed here.
// Swap this for the real registrar inbox before the site goes live.
export const CONTACT_EMAIL = "registrar@acados.com";

export const NAV_LINKS = [
  { href: "/programmes", label: "Programmes" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Where each role lands after signing in
export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  INSTRUCTOR: "/instructor",
  STUDENT: "/student",
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Registrar's Office",
  INSTRUCTOR: "Faculty",
  STUDENT: "Student",
};

// Same scale the backend uses when it turns marks into grade points
export const GRADE_SCALE = [
  { range: "80% and above", letter: "A+", points: "4.00" },
  { range: "75% to 79%", letter: "A", points: "3.75" },
  { range: "70% to 74%", letter: "A-", points: "3.50" },
  { range: "65% to 69%", letter: "B+", points: "3.25" },
  { range: "60% to 64%", letter: "B", points: "3.00" },
  { range: "55% to 59%", letter: "B-", points: "2.75" },
  { range: "50% to 54%", letter: "C+", points: "2.50" },
  { range: "45% to 49%", letter: "C", points: "2.25" },
  { range: "40% to 44%", letter: "D", points: "2.00" },
  { range: "Below 40%", letter: "F", points: "0.00" },
];

// Public demo accounts so evaluators can try each role in one click
export const DEMO_ACCOUNTS: {
  role: Role;
  title: string;
  blurb: string;
  email: string;
  password: string;
}[] = [
  {
    role: "ADMIN",
    title: "Registrar's Office",
    blurb: "Departments, courses, fees and audit records",
    email: "admin@acados.com",
    password: "Admin@123",
  },
  {
    role: "INSTRUCTOR",
    title: "Faculty",
    blurb: "Your sections, attendance and grading",
    email: "tanvir.instructor4@acados.com",
    password: "Instructor@321",
  },
  {
    role: "STUDENT",
    title: "Student",
    blurb: "Enrolment, results and fee payment",
    email: "nusrat.student4@acados.com",
    password: "Student@321",
  },
];
