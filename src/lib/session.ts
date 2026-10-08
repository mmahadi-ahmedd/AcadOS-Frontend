// The proxy/middleware can't read localStorage, so we mirror the token and
// role into two small cookies. The access token lives for a day on the backend.
export const TOKEN_COOKIE = "acados_token";
export const ROLE_COOKIE = "acados_role";

const ONE_DAY = 60 * 60 * 24;

export function writeSessionCookies(token: string, role: string) {
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${ONE_DAY}; samesite=lax`;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${ONE_DAY}; samesite=lax`;
}

export function clearSessionCookies() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
}
