import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({ baseURL, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If several requests fail at once, they all wait on the same refresh call
let refreshInFlight: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, updateAccessToken } = useAuthStore.getState();
  if (!refreshToken) throw new Error("No refresh token stored");

  const res = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
  const token = res.data.data.accessToken as string;
  updateAccessToken(token);
  return token;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const isAuthCall = original?.url?.startsWith("/auth/");

    if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true;
      try {
        refreshInFlight ??= refreshAccessToken().finally(() => {
          refreshInFlight = null;
        });
        const token = await refreshInFlight;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        useAuthStore.getState().endSession();
        if (typeof window !== "undefined") window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

// Turns whatever the backend (or the network) threw at us into a sentence for a toast
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return "We couldn't reach the server. Check your connection and try again.";

  const body = error.response.data as
    | { message?: string; errors?: { message?: string }[] }
    | undefined;

  return body?.errors?.[0]?.message ?? body?.message ?? fallback;
}
