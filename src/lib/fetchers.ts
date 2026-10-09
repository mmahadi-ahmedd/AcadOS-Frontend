import { isAxiosError } from "axios";
import { api } from "@/lib/api";

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export async function getData<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await api.get(url, { params });
  return res.data.data as T;
}

export async function getPage<T>(url: string, params?: Record<string, unknown>) {
  const res = await api.get(url, { params });
  return { rows: res.data.data as T[], meta: res.data.meta as Meta | undefined };
}

export async function send<T = unknown>(method: "post" | "patch" | "delete", url: string, body?: unknown) {
  const res = await api.request({ method, url, data: body });
  return res.data.data as T;
}

export function errorText(error: unknown) {
  if (isAxiosError(error)) return error.response?.data?.message ?? "Something went wrong, please try again";
  return error instanceof Error ? error.message : "Something went wrong";
}