import { isAxiosError } from "axios";
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

function digits(count: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(count));
  return Array.from(bytes, (b) => b % 10).join("");
}

async function saveWithFreshId(make: () => string, save: (id: string) => Promise<unknown>) {
  for (let attempt = 0; ; attempt++) {
    try {
      await save(make());
      return;
    } catch (error) {
      const clash =
        isAxiosError(error) &&
        (error.response?.status === 409 || /unique|taken|already/i.test(String(error.response?.data?.message)));
      if (!clash || attempt >= 3) throw error;
    }
  }
}

export async function createStudentProfile(payload: {
  studentId?: string; 
  departmentId: string;
  programId: string;
  enrollYear: number;
}) {
  await saveWithFreshId(
    () => `${payload.enrollYear}-${digits(5)}`,
    (studentId) =>
      api.post("/users/me/student-profile", {
        studentId,
        departmentId: payload.departmentId,
        programId: payload.programId,
        enrollYear: payload.enrollYear,
      })
  );
}

export async function createInstructorProfile(payload: {
  employeeId?: string; 
  departmentId: string;
  designation?: string;
}) {
  await saveWithFreshId(
    () => `EMP-${digits(5)}`,
    (employeeId) =>
      api.post("/users/me/instructor-profile", {
        employeeId,
        departmentId: payload.departmentId,
        designation: payload.designation,
      })
  );
}