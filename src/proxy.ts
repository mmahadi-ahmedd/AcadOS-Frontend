import { NextRequest, NextResponse } from "next/server";
import { ROLE_HOME } from "@/lib/constants";
import { ROLE_COOKIE, TOKEN_COOKIE } from "@/lib/session";
import type { Role } from "@/types";

// Each area of the app belongs to exactly one role
const AREA_OWNER: Record<string, Role> = {
  "/admin": "ADMIN",
  "/instructor": "INSTRUCTOR",
  "/student": "STUDENT",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value as Role | undefined;
  const signedIn = Boolean(token && role && role in ROLE_HOME);

  const area = Object.keys(AREA_OWNER).find(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (area) {
    if (!signedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Signed in, but wandering into someone else's area: send them home
    if (AREA_OWNER[area] !== role) {
      return NextResponse.redirect(new URL(ROLE_HOME[role!], request.url));
    }
  }

  // No point showing the sign-in form to someone already signed in
  if (pathname === "/login" && signedIn) {
    return NextResponse.redirect(new URL(ROLE_HOME[role!], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*", "/student/:path*", "/login"],
};
