import type { Role } from "@/types";

export const SITE_NAME = "AcadOS";

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
