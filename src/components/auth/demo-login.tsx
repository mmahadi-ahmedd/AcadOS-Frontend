"use client";

import { BookOpenCheck, GraduationCap, Landmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/use-login";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import type { Role } from "@/types";

const ROLE_ICON: Record<Role, typeof Landmark> = {
  ADMIN: Landmark,
  INSTRUCTOR: BookOpenCheck,
  STUDENT: GraduationCap,
};

export function DemoLogin({ redirectTo }: { redirectTo?: string | null }) {
  const login = useLogin(redirectTo);
  const activeEmail = login.isPending ? login.variables?.email : null;

  return (
    <ul className="space-y-3">
      {DEMO_ACCOUNTS.map((account) => {
        const Icon = ROLE_ICON[account.role];
        const isLoading = activeEmail === account.email;

        return (
          <li
            key={account.role}
            className="flex items-center gap-3 rounded-md border bg-card p-3"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight">{account.title}</p>
              <p className="truncate text-sm text-muted-foreground">{account.blurb}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={login.isPending}
              onClick={() => login.mutate({ email: account.email, password: account.password })}
              aria-label={`Demo login as ${account.title}`}
            >
              {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
              Demo login
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
