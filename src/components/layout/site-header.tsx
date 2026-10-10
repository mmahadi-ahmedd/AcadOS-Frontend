"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { NAV_LINKS, ROLE_HOME, ROLE_LABEL, SITE_NAME } from "@/lib/constants";
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
          <div className="flex gap-2 pt-3">
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

// Signed-out visitors see sign in; signed-in people see an avatar with a small menu
function AuthLinks() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const endSession = useAuthStore((state) => state.endSession);
  const [open, setOpen] = useState(false);

  if (!mounted) return <span className="block h-8 w-28" aria-hidden />;

  if (!user) {
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

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function signOut() {
    setOpen(false);
    endSession();
    queryClient.clear();
    router.replace("/");
  }

  const item = "block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary";

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 hover:bg-secondary"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {initials}
        </span>
        <span className="max-w-28 truncate text-sm font-medium text-primary">{user.name.split(" ")[0]}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div role="menu" className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-card p-1 shadow-md">
            <div className="border-b px-3 py-2">
              <p className="truncate text-sm font-medium text-primary">{user.name}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABEL[user.role]}</p>
            </div>
            <Link role="menuitem" href={ROLE_HOME[user.role]} onClick={() => setOpen(false)} className={item}>
              Dashboard
            </Link>
            {user.role !== "ADMIN" && (
              <Link
                role="menuitem"
                href={`${ROLE_HOME[user.role]}/profile`}
                onClick={() => setOpen(false)}
                className={item}
              >
                Profile
              </Link>
            )}
            <button type="button" role="menuitem" onClick={signOut} className={`${item} text-destructive`}>
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}