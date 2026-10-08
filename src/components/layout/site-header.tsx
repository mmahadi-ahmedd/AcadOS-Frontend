"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { NAV_LINKS, ROLE_HOME, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-semibold text-primary">
          <GraduationCap className="size-6 text-gold" aria-hidden />
          {SITE_NAME}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} active={pathname.startsWith(link.href)}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <AuthLinks />
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-primary hover:bg-secondary md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t bg-background px-5 pb-5 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b py-3 font-medium text-primary last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-2 pt-3" onClick={() => setMenuOpen(false)}>
            <AuthLinks />
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 py-1 text-sm font-medium transition-colors",
        active ? "border-gold text-primary" : "border-transparent text-foreground/70 hover:text-primary"
      )}
    >
      {children}
    </Link>
  );
}

// Waits for the saved session to load, so the buttons don't flicker on first paint
function AuthLinks() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  if (hydrated && user) {
    return (
      <Link href={ROLE_HOME[user.role]} className={buttonVariants({ size: "sm" })}>
        Go to dashboard
      </Link>
    );
  }

  return (
    <>
      <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        Sign in
      </Link>
      <Link href="/register" className={buttonVariants({ size: "sm" })}>
        Create account
      </Link>
    </>
  );
}
