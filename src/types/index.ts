export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: PageMeta;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors: { path?: string; message?: string }[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Program {
  id: string;
  name: string;
  degreeLevel: string;
  totalCredits: number;
  departmentId: string;
}

export interface ProgramWithDepartment extends Program {
  department: Department;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditHours: number;
  department: Department;
  prerequisites: { prerequisite: { id: string; code: string; title: string } }[];
}
