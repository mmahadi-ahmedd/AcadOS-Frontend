import { cacheLife } from "next/cache";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import type { ApiSuccess, Course, Department, ProgramWithDepartment } from "@/types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

async function readJson<T>(path: string, token: string): Promise<ApiSuccess<T>> {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Catalogue request failed: ${path} (${res.status})`);
  return res.json();
}

// The catalogue endpoints sit behind sign-in, so the server reads them as the
// demo student account. Nothing here reaches the visitor's browser.
async function signInForCatalogue(): Promise<string> {
  const student = DEMO_ACCOUNTS.find((account) => account.role === "STUDENT");
  if (!student) throw new Error("No demo student account configured");

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: student.email, password: student.password }),
  });
  if (!res.ok) throw new Error(`Catalogue sign-in failed (${res.status})`);

  const body = await res.json();
  return body.data.accessToken as string;
}

// Cached for a few hours, so visitors don't hit the API on every page view
export async function getCatalog() {
  "use cache";
  cacheLife("hours");

  const token = await signInForCatalogue();
  const [departments, programmes, courses] = await Promise.all([
    readJson<Department[]>("/departments?limit=100", token),
    readJson<ProgramWithDepartment[]>("/programs?limit=100", token),
    readJson<Course[]>("/courses?limit=100", token),
  ]);

  return {
    departments: departments.data,
    programmes: programmes.data,
    courses: courses.data,
  };
}
