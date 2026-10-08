"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { loginRequest } from "@/lib/auth-api";
import { ROLE_HOME } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";

export function useLogin(redirectTo?: string | null) {
  const router = useRouter();
  const startSession = useAuthStore((state) => state.startSession);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginRequest(email, password),

    onSuccess: (session) => {
      startSession(session);
      toast.success(`Welcome back, ${session.user.name.split(" ")[0]}`);

      // Follow ?next= only when it stays inside this role's own area
      const home = ROLE_HOME[session.user.role];
      const target = redirectTo && redirectTo.startsWith(home) ? redirectTo : home;
      router.replace(target);
    },

    onError: (error) => toast.error(getErrorMessage(error, "We couldn't sign you in.")),
  });
}
