import { api } from "@/lib/api";
import type { ApiSuccess, Role, SessionUser } from "@/types";

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

export async function loginRequest(email: string, password: string) {
  const res = await api.post<ApiSuccess<LoginResult>>("/auth/login", { email, password });
  return res.data.data;
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}) {
  await api.post("/auth/register", payload);
}

export async function createStudentProfile(payload: {
  studentId: string;
  departmentId: string;
  programId: string;
  enrollYear: number;
}) {
  await api.post("/users/me/student-profile", payload);
}

export async function createInstructorProfile(payload: {
  employeeId: string;
  departmentId: string;
  designation?: string;
}) {
  await api.post("/users/me/instructor-profile", payload);
}
