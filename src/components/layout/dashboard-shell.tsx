"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ProfilePrompt } from "@/components/profile/profile-prompt";
import {
  BarChart3, BookOpen, ClipboardList, CreditCard, GraduationCap,
  LayoutDashboard, LogOut, Menu, UserCircle, Users, X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { ROLE_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const icons = { home: LayoutDashboard, users: Users, chart: BarChart3, book: BookOpen, card: CreditCard, user: UserCircle, list: ClipboardList };

export interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof icons;
}

export function DashboardShell({ links, children }: { links: NavItem[]; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const endSession = useAuthStore((s) => s.endSession);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  function signOut() {
    endSession();
    queryClient.clear();
    router.replace("/login");
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon }) => {
        const Icon = icons[icon];
        const active = href === links[0].href ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              active ? "bg-primary text-primary-foreground" : "text-primary hover:bg-secondary"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[15rem_1fr]">
      <aside className="hidden border-r bg-card p-4 md:flex md:flex-col md:justify-between">
        <div>
          <Link href="/" className="mb-6 flex items-center gap-2 px-2 text-xl font-semibold text-primary">
            <GraduationCap className="size-6 text-gold" aria-hidden /> AcadOS
          </Link>
          {nav}
        </div>
        <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary">
          <LogOut className="size-4" aria-hidden /> Sign out
        </button>
      </aside>

      <div>
        <header className="flex items-center justify-between border-b bg-card px-4 py-3">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <p className="hidden text-sm text-muted-foreground md:block">
            {user ? ROLE_LABEL[user.role] : ""}
          </p>
          <p className="text-sm font-medium text-primary">{user?.name}</p>
        </header>
        <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
          <ProfilePrompt />
          {children}
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-64 bg-card p-4" onClick={(e) => e.stopPropagation()}>
            <button className="mb-4" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="size-5" />
            </button>
            {nav}
            <button onClick={signOut} className="mt-6 flex items-center gap-2 px-3 text-sm text-muted-foreground">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}