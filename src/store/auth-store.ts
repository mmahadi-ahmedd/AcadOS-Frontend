"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionUser } from "@/types";
import { clearSessionCookies, writeSessionCookies } from "@/lib/session";

interface SessionPayload {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: SessionUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  startSession: (payload: SessionPayload) => void;
  updateAccessToken: (token: string) => void;
  endSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hydrated: false,

      startSession: ({ user, accessToken, refreshToken }) => {
        writeSessionCookies(accessToken, user.role);
        set({ user, accessToken, refreshToken });
      },

      updateAccessToken: (token) => {
        const role = get().user?.role;
        if (role) writeSessionCookies(token, role);
        set({ accessToken: token });
      },

      endSession: () => {
        clearSessionCookies();
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: "acados-session",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hydrated: true });
      },
    }
  )
);
