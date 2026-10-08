import { api } from "@/lib/api";
import type { ApiSuccess, Department, Program } from "@/types";

export async function fetchDepartments() {
  const res = await api.get<ApiSuccess<Department[]>>("/departments", { params: { limit: 100 } });
  return res.data.data;
}

export async function fetchPrograms(departmentId: string) {
  const res = await api.get<ApiSuccess<Program[]>>("/programs", {
    params: { departmentId, limit: 100 },
  });
  return res.data.data;
}
